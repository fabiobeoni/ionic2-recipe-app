import {Component} from '@angular/core';
import {RecipeEditPage} from "../recipe-edit/recipe-edit";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ToastCtrl} from "../../utils/toast-ctrl";
import {RecipeDifficultyOptions} from "../recipe-difficulty-options";
import {ShoppingListService} from "../../services/shopping-list-service";
import {Ingredient} from "../../models/ingradient";


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  private _recipes:Recipe[] = [];
  private _difficultyOptions = RecipeDifficultyOptions;

  recipeEditPage = RecipeEditPage;

  get recipes(): Recipe[] {
    return this._recipes;
  }

  constructor(
    private _recipeSrv:RecipeService,
    private _toastCtrl: ToastCtrl,
    private _shoppingListSrv:ShoppingListService
  ) {}

  ionViewWillEnter(){
    this._recipeSrv.getRecipes((recipes:Recipe[],err:Error) => {
      this._recipes = recipes;

      if(err) this._toastCtrl.info(err.message,ToastCtrl.LENGTH_LONG);
    });
  }

  addIngredientsToShoppingList(ingredients:Ingredient[],ev):void{
    ev.stopPropagation();

    this._shoppingListSrv.addIngredients(ingredients);
    this._toastCtrl.info(
      `${ingredients.length} ingredients added to shopping list.`,
      ToastCtrl.LENGTH_SHORT
    );
  }

  getDifficultyOptionLabel(value:number):string{
    return this._difficultyOptions.options.find(o=>o.value==value).label;
  }

}
