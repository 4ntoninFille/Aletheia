import { getProductInfo } from './api';

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
    }
});