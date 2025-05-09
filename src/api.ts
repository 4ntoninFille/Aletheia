const BASE_URL = 'http://35.180.111.230:8010/api/v1/aletheia/products';

export async function getProductInfo(barcode: string): Promise<any> {
    const url = `${BASE_URL}/${barcode}`;
    console.log("API call to URL: ", url);
    const response = await fetch(url);
    return response.json();
}

export async function getProductsInfo(barcodes: string[]): Promise<any> {
    const url = `${BASE_URL}/search`;
    console.log("API call to URL: ", url);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: barcodes })
    });
    return response.json();
}