import {Recipe} from "../models/recipe";

export class RecipeService{

  private recipes:Recipe[] = [];

  getRecipes():Recipe[]{
    return this.recipes.slice();
  }

  getNewRecipe():Recipe{
    return Recipe.factory();
  }

  addRecipe(recipe:Recipe):boolean {
    let exists = this.recipes.find(o=>o.title.trim().toLocaleLowerCase()==recipe.title.trim().toLocaleLowerCase());
    if(!exists){
      this.recipes.push(recipe);
      return true;
    }
    else
      return false;
  }

  removeRecipe(recipe:Recipe){
    let index = this.recipes.findIndex(o=>o.title.toLowerCase()==recipe.title.toLowerCase());
    this.recipes.splice(index,1);
  }

}
