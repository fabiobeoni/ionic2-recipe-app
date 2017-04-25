import {Component} from '@angular/core';
import {RecipeEditPage} from "../recipe-edit/recipe-edit";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ToastWrapper} from "../../utils/toast-wrp";
import {RecipeDifficultyOptions} from "../recipe-difficulty-options";
import {ShoppingListService} from "../../services/shopping-list-service";
import {Ingredient} from "../../models/ingradient";
import {LoadingController} from "ionic-angular";


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  private _recipes:Recipe[] = [];
  private _difficultyOptions = RecipeDifficultyOptions;

  recipeEditPage = RecipeEditPage;

  constructor(
    private _recipeSrv:RecipeService,
    private _toastWrp: ToastWrapper,
    private _shoppingListSrv:ShoppingListService,
    private _loadingCtrl:LoadingController
  ) {}

  ionViewWillEnter(){
    let loading = this._loadingCtrl.create({content:'Reading data...'});
    loading.present();

    this._recipeSrv.getRecipes((recipes:Recipe[],err:Error) => {
      loading.dismiss();

      if(!err) this._recipes = recipes;
      else this._toastWrp.info(err.message,ToastWrapper.LENGTH_LONG);
    });
  }

  private addIngredientsToShoppingList(ingredients:Ingredient[],ev):void{
    ev.stopPropagation();

    this._shoppingListSrv.addIngredients(ingredients);
    this._toastWrp.info(
      `${ingredients.length} ingredients added to shopping list.`,
      ToastWrapper.LENGTH_SHORT
    );
  }

  private getDifficultyOptionLabel(value:number):string{
    return this._difficultyOptions.options.find(o=>o.value==value).label;
  }

}
