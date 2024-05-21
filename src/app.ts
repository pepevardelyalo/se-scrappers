import express, { Request, Response, Application } from "express";
import { getScorpionProducts } from "./stores/scorpion";
import dotenv from "dotenv";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.get("/scorpion/:productToLookFor", async (req: Request, res: Response) => {
  const { productToLookFor } = req.params;

  try {
    const products = await getScorpionProducts(productToLookFor);
    res.json(products);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping the website." });
  }
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
