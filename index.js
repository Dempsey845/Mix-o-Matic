import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

async function formatCocktailDrink(drink) {
  const n = drink.strDrink;
  const c = drink.strCategory;
  const iA = drink.strAlcoholic;
  const g = drink.strGlass;
  const i = drink.strInstructions;
  const iURL = drink.strDrinkThumb + "/small";

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

  return {
    drinkName: n,
    category: c,
    isAlcoholic: iA,
    glass: g,
    instructions: i,
    imageURL: iURL,
    ingredients: ingr,
    measures: meas,
  };
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

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
