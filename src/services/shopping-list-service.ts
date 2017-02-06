import {Ingredient} from "../models/ingradient";

export class ShoppingListService{

  private ingredients:Ingredient[] = [];

  getIngredients(){
    this.ingredients.slice();
  }

  getNewIngredient():Ingredient{
    return Ingredient.factory();
  }

  addIngredient(ingredient:Ingredient) {
    this.ingredients.push(ingredient);
  }

  addIngredients(ingredients:Ingredient[]){
    this.ingredients.push(...ingredients);
  }

}
