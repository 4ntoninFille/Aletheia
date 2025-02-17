console.log('Content script loaded');

// Function to extract the barcode from the URL
function extractBarcodeFromURL(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
}

function createProductInfo(name: string, nutriScore: string, ecoScore: string): HTMLElement {
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
    `;
    return infoElement;
}

function processProduct(productElement: HTMLElement, productInfo: any) {
    if (productElement.dataset.processed) return;

    console.log('Product Info:', productInfo);
    // Create the product information element
    const infoElement = createProductInfo(
        productInfo.name,
        productInfo.nutriScore,
        productInfo.ecoScore
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

    productElement.dataset.processed = 'true';
}

// Function to process all product items in the grid
function processProductGrid(): void {
    const productGrid = document.querySelector('.stime-product-list__grid') as HTMLElement | null;
    if (productGrid) {
        const productItems = productGrid.querySelectorAll<HTMLElement>('.stime-product-list__item');
        const barcodes: string[] = [];

        productItems.forEach((productElement) => {
            const productLink = productElement.querySelector('a.link.link--link.productCard__link') as HTMLAnchorElement | null;
            if (productLink) {
                const href = productLink.getAttribute('href');
                if (href) {
                    const barcode = extractBarcodeFromURL(href);
                    console.log('Barcode found:', barcode);
                    if (barcode) {
                        barcodes.push(barcode);
                    }
                }
            }
        });

        if (barcodes.length > 0) {
            // Send message to background script with the extracted barcodes
            console.log('ready to send message');
            chrome.runtime.sendMessage(
                { type: 'getProductsInfo', barcodes: barcodes },
                (response) => {
                    if (response && response.products) {
                        productItems.forEach((productElement, index) => {
                            const barcode = barcodes[index];
                            const productInfo = response.products.find((product: any) => product.barcode === barcode);
                            console.log('processing product:', productInfo);
                            if (productInfo) {
                                processProduct(productElement, productInfo);
                            }
                        });
                    }
                }
            );
        }
    } else {
        console.log('Product grid not found');
    }
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timer: NodeJS.Timeout | null = null;
    return ((...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    }) as T;
}

// MutationObserver to handle dynamic changes
const observer = new MutationObserver(
    debounce(() => {
        observer.disconnect(); // Temporarily disconnect to avoid loops
        processProductGrid();
        observer.observe(document.body, { childList: true, subtree: true }); // Reconnect observer
    }, 200) // Debounce delay (adjust as needed)
);

// Observe the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial check when the page loads
window.onload = (): void => {
    processProductGrid();
};

console.log('Content script done');