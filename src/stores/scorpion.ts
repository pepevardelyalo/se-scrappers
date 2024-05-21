import { IProductResult } from "../types/product";
import puppeteer from "puppeteer";

export const getScorpionProducts = async (
  productToLookFor: string
): Promise<IProductResult[]> => {
  let result: IProductResult[] = [];

  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 50,
    args: ["--window-size=1920,1920", "--no-sandbox"], // Set the window size
  }); // slowMo adds a delay between actions
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  // Example URL, modify based on your target website
  await page.goto(
    `https://www.scorpion.com.mx/mayorista/catalogsearch/result/?q=${encodeURIComponent(
      productToLookFor
    )}`,
    { waitUntil: "networkidle2" }
  );

  await page.waitForSelector(".item.product.product-item");

  // Extract product data (modify selector based on the target website)
  result = await page.evaluate(() => {
    const products = Array.from(
      document.querySelectorAll(".item.product.product-item")
    );
    return products.map((product) => {
      //@ts-ignore
      const name = product.querySelector(".product-item-link")?.innerText || "";
      const imageUrl =
        product
          .querySelector(".product-image-photo")
          ?.getAttribute("data-src") || "";
      console.log({ imageUrl });
      //@ts-ignore
      const priceElement = product.querySelector(".price > .price")?.innerText;

      const price = priceElement
        ? parseFloat(priceElement.replace("$", ""))
        : 0;

      const sku = product.getAttribute("data-sku") || "";

      return {
        name,
        price,
        sku,
        //@ts-ignore
        img: product.querySelector(".product-item-link")?.href || "",
      };
    });
  });

  console.log(result);

  await browser.close();

  return result;
};
