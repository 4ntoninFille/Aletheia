import { getProductInfo, getProductsInfo } from './api';
let activeFilters: string[] = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.barcode);
    if (request.type === 'getProductInfo') {
        getProductInfo(request.barcode).then((data) => {
            sendResponse({
                name: data.product_name,
                nutriScore: data.nutriscore_grade || 'Na',
                ecoScore: data.ecoscore_grade || 'Na',
            });
        });
        return true;
    } else if (request.type === 'getProductsInfo') {
        getProductsInfo(request.barcodes).then((data) => {
            if (data && data.products_info) {
                const products = data.products_info.map((product: any) => ({
                    barcode: product.code,
                    name: product.product_name,
                    nutriScore: product.nutriscore_grade || 'Na',
                    ecoScore: product.ecoscore_grade || 'Na',
                }));
                sendResponse({ products });
            } else {
                sendResponse({ products: [] });
            }
        }).catch((error) => {
            console.error('Error fetching products info:', error);
            sendResponse({ products: [] });
        });
        return true;
    } else if (request.type === 'setFilters') {
        // activeFilters = request.filters;
        // // Notify content script that filters have changed
        // chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        //     if (tabs[0].id) {
        //         chrome.tabs.sendMessage(tabs[0].id, {type: 'filtersUpdated', filters: activeFilters});
        //     }
        // });
    } else if (request.type === 'getFilters') {
        // sendResponse(activeFilters);
    }
});