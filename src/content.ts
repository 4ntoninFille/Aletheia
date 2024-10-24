console.log('Content script loaded');

// Function to extract the barcode from the URL
function extractBarcodeFromURL(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
}

function createProductInfo(name: string, nutriScore: string, ecoScore: string, carbonFootprint: string | number): HTMLElement {
    const infoElement = document.createElement('div');
    infoElement.style.cssText = `
        background-color: #f0f0f0;
        padding: 10px;
        margin-top: 10px;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
    `;

    // Function to get Nutri-Score color
    const getScoreColor = (score: string): string => {
        const colors: { [key: string]: string } = {
            'A': '#038141',
            'B': '#85BB2F',
            'C': '#FECB02',
            'D': '#EE8100',
            'E': '#E63E11'
        };
        return colors[score.toUpperCase()] || '#000000';
    };

    // Function to get score display
    const getScoreDisplay = (score: string): string => {
        if (score.toUpperCase() === 'UNKNOWN') {
            return '<span style="color: red; font-weight: bold;">Na</span>';
        }
        return `<span style="background-color: ${getScoreColor(score)}; color: white; padding: 2px 5px; border-radius: 3px;">
          ${score.toUpperCase()}
        </span>`;
    };

    infoElement.innerHTML = `
      <p>
        <strong>Nutri-Score:</strong> 
        ${getScoreDisplay(nutriScore)}
      </p>
      <p>
        <strong>Eco-Score:</strong> 
        ${getScoreDisplay(ecoScore)}
      </p>
      <p>
        <strong>Carbon Footprint:</strong> 
        <span style="color: green; font-weight: bold;">
          ${carbonFootprint === 'Na' || carbonFootprint === 'UNKNOWN' ? '<span style="color: red;">Na</span>' : `${carbonFootprint}`}
        </span>
      </p>
    `;
    return infoElement;
}

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

                            // Create the product information element
                            const infoElement = createProductInfo(
                                response.name,
                                response.nutriScore,
                                response.ecoScore,
                                response.carbonFootprint
                            );

                            // Find the price element
                            const priceElement = productElement.querySelector('.stime-product--footer__prices');
                            
                            if (priceElement) {
                                // Create a container for the new elements
                                const container = document.createElement('div');
                                container.style.cssText = `
                                    width: 100%;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                `;

                                // Append the info element to the container
                                container.appendChild(infoElement);

                                // If there's a price element, move it into the container
                                if (priceElement.parentNode) {
                                    priceElement.parentNode.insertBefore(container, priceElement);
                                    container.appendChild(priceElement);
                                }
                            } else {
                                console.log('Price element not found');
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