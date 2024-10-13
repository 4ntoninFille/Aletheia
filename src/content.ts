console.log('Content script loaded');

// Function to extract the barcode from the URL
function extractBarcodeFromURL(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
}

// Function to create and append product info element
function appendProductInfo(parent: Element, name: string, nutriScore: string, carbonFootprint: string | number): void {
    const infoElement = document.createElement('div');
    infoElement.style.cssText = 'background-color: #f0f0f0; padding: 10px; margin-top: 10px; border-radius: 5px;';

    // Function to get Nutri-Score color
    const getNutriScoreColor = (score: string): string => {
        const colors: { [key: string]: string } = {
            'A': '#038141',
            'B': '#85BB2F',
            'C': '#FECB02',
            'D': '#EE8100',
            'E': '#E63E11'
        };
        return colors[score.toUpperCase()] || '#000000';
    };

    // Function to calculate Eco-Score (simplified version)
    const calculateEcoScore = (carbonFootprint: string | number): { score: string; color: string } => {
        if (carbonFootprint === 'NA' || carbonFootprint === '') {
            return { score: 'Unknown', color: '#808080' }; // Gray color for unknown
        }

        const footprintValue = typeof carbonFootprint === 'string' ? parseFloat(carbonFootprint) : carbonFootprint;
        if (isNaN(footprintValue)) {
            return { score: 'Unknown', color: '#808080' }; // Gray color for invalid values
        }

        let score: string;
        let color: string;

        if (footprintValue <= 0.1) {
            score = 'A';
            color = '#038141';
        } else if (footprintValue <= 0.4) {
            score = 'B';
            color = '#85BB2F';
        } else if (footprintValue <= 0.8) {
            score = 'C';
            color = '#FECB02';
        } else if (footprintValue <= 1.5) {
            score = 'D';
            color = '#EE8100';
        } else {
            score = 'E';
            color = '#E63E11';
        }

        return { score, color };
    };

    const ecoScore = calculateEcoScore(carbonFootprint);

    infoElement.innerHTML = `
      <p>
        <strong>Nutri-Score:</strong> 
        <span style="background-color: ${getNutriScoreColor(nutriScore)}; color: white; padding: 2px 5px; border-radius: 3px;">
          ${nutriScore.toUpperCase()}
        </span>
      </p>
      <p>
        <strong>Eco-Score:</strong> 
        <span style="background-color: ${ecoScore.color}; color: white; padding: 2px 5px; border-radius: 3px;">
          ${ecoScore.score}
        </span>
      </p>
      <p>
        <strong>Carbon Footprint:</strong> 
        <span style="color: ${ecoScore.color}; font-weight: bold;">
          ${carbonFootprint === 'Na' ? 'Na' : `${carbonFootprint}`}
        </span>
      </p>
    `;
    parent.appendChild(infoElement);
}



// Function to process a single product
function processProduct(productElement: Element) {
    const productLink = productElement.querySelector('a.link.link--link.productCard__link') as HTMLAnchorElement | null;

    if (productLink) {
        const href = productLink.getAttribute('href');
        if (href) {
            const barcode = extractBarcodeFromURL(href);
            if (barcode) {
                console.log('Barcode found:', barcode);

                // Send message to background script with the extracted barcode
                chrome.runtime.sendMessage(
                    { type: 'getProductInfo', barcode: barcode },
                    (response) => {
                        if (response && response.name && response.nutriScore) {
                            console.log('Product Info:', response);

                            // Display the product information on the page
                            const productContainer = productLink.closest('.stime-product-card-course');
                            if (productContainer) {
                                appendProductInfo(
                                    productContainer,
                                    response.name,
                                    response.nutriScore,
                                    response.carbonFootprint
                                );
                            }
                        }
                    }
                );
            } else {
                console.log('Barcode not found in URL');
            }
        } else {
            console.log('Product link href not found');
        }
    } else {
        console.log('Product link element not found');
    }
}

// Find all product items in the grid
const productGrid = document.querySelector('.stime-product-list__grid');
if (productGrid) {
    const productItems = productGrid.querySelectorAll('.stime-product-list__item');
    productItems.forEach(processProduct);
} else {
    console.log('Product grid not found');
}

console.log('Content script done');