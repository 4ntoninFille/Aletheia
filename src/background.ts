import { getProductInfo, getProductsInfo, ProductInfo } from './api';
// const activeFilters: string[] = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.barcode);
  if (request.type === 'getProductInfo') {
    getProductInfo(request.barcode).then((data: ProductInfo) => {
      sendResponse(data);
    });
    return true;
  } else if (request.type === 'getProductsInfo') {
    getProductsInfo(request.barcodes)
      .then((data: { products_info: ProductInfo[] }) => {
        if (data && data.products_info) {
          const products = data.products_info;
          sendResponse({ products });
        } else {
          sendResponse({ products: [] });
        }
      })
      .catch(error => {
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
