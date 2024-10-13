export async function getProductInfo(barcode: string): Promise<any> {
    const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}`;
    const response = await fetch(url);
    return response.json();
}