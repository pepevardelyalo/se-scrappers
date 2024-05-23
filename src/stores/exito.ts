import { IProductResult } from "../types/product";
import puppeteer from "puppeteer";

export const getExitoProducts = async (
  productToLookFor: string
): Promise<IProductResult[]> => {
  let result: IProductResult[] = [];

  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 50,
    args: ["--window-size=1920,1920", "--no-sandbox"], // Set the window size
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(
    `https://www.exito.com/s?q=${encodeURIComponent(productToLookFor)}`,
    { waitUntil: "networkidle2" }
  );

  await page.waitForSelector("[class^='product-grid_fs-product-grid']");

  // Extract product data (modify selector based on the target website)
  result = await page.evaluate(() => {
    const products = Array.from(
      document.querySelectorAll("[class^='product-card-market_fsProductCard']")
    );
    return products.map((product) => {
      const name =
        //@ts-ignore
        product.querySelector("h3 a[class*='link_fs-link']")?.innerText || "";
      const img =
        product.querySelector("img.imagen_plp")?.getAttribute("src") || "";

      const priceElement = product.querySelector(
        "p[class^='ProductPrice_container__price']"
        //@ts-ignore
      )?.innerText;

      const price = priceElement
        ? parseFloat(priceElement.replace("$", ""))
        : 0;

      const sku = product.getAttribute("data-fs-product-card-sku") || "";

      return {
        name,
        price,
        sku,
        img,
      };
    });
  });

  await browser.close();

  return result;
};
