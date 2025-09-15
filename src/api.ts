const BASE_URL = 'https://aletheia-server-1038641305939.europe-west9.run.app/api/v1/aletheia/products';

export async function getProductInfo(barcode: string): Promise<any> {
    const url = `${BASE_URL}/${barcode}`;
    console.log("API call to URL: ", url);
    const response = await fetch(url);
    return response.json();
}

export async function getProductsInfo(barcodes: string[]): Promise<any> {

    const url = `${BASE_URL}/search`;
    console.log("API call to URL: ", url);
    console.log("length ", barcodes.length);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: barcodes })
    });
    const data = await response.json();
    console.log("resp ", data.products_info);
    return data;
}