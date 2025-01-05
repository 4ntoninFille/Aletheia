export async function getProductInfo(barcode: string): Promise<any> {
    console.log("API call to http://127.0.0.1:8080/api/v1/aletheia/products/")
    const url = `http://127.0.0.1:8080/api/v1/aletheia/products/${barcode}`;
    const response = await fetch(url);
    return response.json();
}