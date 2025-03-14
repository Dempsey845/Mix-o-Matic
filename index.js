import express from "express";
import axios from "axios";
import path, { format } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

async function formatCocktailDrink(drink) {
  const n = drink.strDrink;
  const c = drink.strCategory;
  const iA = drink.strAlcoholic;
  const g = drink.strGlass;
  const i = drink.strInstructions;
  const iURL = drink.strDrinkThumb;
  const id = drink.idDrink;

  console.log(drink);

  var ingr = [];
  Object.entries(drink).forEach(([key, value]) => {
    const slicedKey = key.slice(0, 6); // "strIng"
    if (slicedKey == "strIng" && value != null) {
      ingr.push(value);
    }
  });

  var meas = [];
  Object.entries(drink).forEach(([key, value]) => {
    const slicedKey = key.slice(0, 6);
    if (slicedKey == "strMea" && value != null) {
      meas.push(value);
    }
  });

  var ingrMeas = [];
  for (let i = 0; i < ingr.length; i++) {
    ingrMeas.push(`${meas[i]} of ${ingr[i]}`);
  }

  return {
    drinkName: n,
    category: c,
    isAlcoholic: iA,
    glass: g,
    instructions: i,
    imageURL: iURL,
    ingredients: ingr,
    measures: meas,
    ingredientsAndMeasures: ingrMeas,
    drinkID: id,
  };
}

async function getDrinkHeadersFromID(drinkID) {
  try {
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`
    );
    const headers = await formatCocktailDrink(response.data.drinks[0]);
    return headers;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    const headers = await formatCocktailDrink(response.data.drinks[0]);
    res.render("index.ejs", headers);
  } catch (error) {
    console.log("Failed to make request: ", error.message);
  }
});

app.get("/drink/:id", async (req, res) => {
  const drinkID = req.params.id;
  const headers = await getDrinkHeadersFromID(drinkID);
  if (headers != undefined) {
    res.render("drink.ejs", headers);
  } else {
    // Error fetching drink with ID
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
