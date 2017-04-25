import {Ingredient} from "../models/ingradient";

export class ShoppingListService{

  private ingredients:any[] = [];

  getIngredients():Ingredient[]{
    return this.ingredients.slice();
  }

  getNewIngredient():Ingredient{
    return Ingredient.factory('Ingredient Name',0);
  }

  getIngredientIndex(ingredient:Ingredient):number{
    return this.ingredients.findIndex(o=>o.name==ingredient.name);
  }

  /**
   * Add the given ingredient to the list if
   * the ingredient is unique in the list.
   * @param ingredient {Ingredient}
   * @returns {boolean} : false if the ingredient is already present in the list.
   */
  addIngredient(ingredient:Ingredient):boolean {
    let exists = this.ingredients.find(o=>o.name.trim().toLocaleLowerCase()==ingredient.name.trim().toLocaleLowerCase());
    if(!exists){
      this.ingredients.push(ingredient);
      return true;
    }
    else
      return false;
  }

  addIngredients(ingredients:Ingredient[]){
    this.ingredients.push(...ingredients);
  }

  removeIngredient(ingredient:Ingredient){
    let index = this.getIngredientIndex(ingredient);
    this.ingredients.splice(index,1);
  }

}
