import { getProductInfo } from './api';
let activeFilters: string[] = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.barcode);
    if (request.type === 'getProductInfo') {
        getProductInfo(request.barcode).then((data) => {
            sendResponse({
                name: data.product.product_name,
                nutriScore: data.product.nutriscore_grade || 'Na',
                ecoScore: data.product.ecoscore_grade || 'Na',
                carbonFootprint: data.product.nutriments['carbon-footprint-from-known-ingredients_100g'] || 'Na'
            });
        });
        return true; // Indicates that the response is asynchronous
    } else if (request.type === 'setFilters') {
        activeFilters = request.filters;
        // Notify content script that filters have changed
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'filtersUpdated', filters: activeFilters});
            }
        });
    } else if (request.type === 'getFilters') {
        sendResponse(activeFilters);
    }
});