import { getProductInfo } from './api';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getProductInfo') {
        getProductInfo(request.barcode).then((data) => {
            sendResponse({ nutriScore: data.product.nutriscore_grade });
        });
        return true; // Indicates that the response is asynchronous
    }
});