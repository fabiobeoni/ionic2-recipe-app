import {Component} from '@angular/core';
import {RecipeEditPage} from "../recipe-edit/recipe-edit";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ToastWrapper} from "../../utils/toast-wrp";
import {RecipeDifficultyOptions} from "../recipe-difficulty-options";
import {ShoppingListService} from "../../services/shopping-list-service";
import {Ingredient} from "../../models/ingradient";
import {Events, LoadingController} from "ionic-angular";
import {BackupPage} from "../backup/backup";


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  /**
   * View model object to present
   * a list of recipes on this page.
   * @type {Array}
   * @private
   */
  private _recipes:Recipe[] = [];

  /**
   * Page to edit the selected
   * recipe on this page
   * @type {RecipeEditPage}
   * @private
   */
  _recipeEditPage = RecipeEditPage;

  constructor(
    private _recipeSrv:RecipeService,
    private _toastWrp: ToastWrapper,
    private _shoppingListSrv:ShoppingListService,
    private _loadingCtrl:LoadingController,
    private _events:Events
  ) {

    //after restoring the recipes backup (BackupPage)
    //an event is fired to inform this page that is again
    //on root view and it has to perform a data loading
    //to update the list of recipes that normally is
    //loaded only on viewWillEnter
    this._events.subscribe(BackupPage.RECIPES_RESTORED_EVENT,()=>{
      this._loadRecipes();
    });
  }

  ionViewWillEnter(){
    this._loadRecipes();
  }

  /**
   * Loads recipes data and shows
   * loading message to the user
   * if needed.
   */
  private _loadRecipes() {
    let loading = this._loadingCtrl.create({content: 'Reading data...'});

    //if the data are not loaded from
    //the storage in less then half second,
    //them displays a loading to the user
    setTimeout(() => {
      if (loading) loading.present();
    }, 500);

    //loads the recipes from the local database
    this._recipeSrv.getRecipes((recipes: Recipe[], err: Error) => {
      loading.dismiss();
      loading = null;

      if (!err) this._recipes = recipes;
      else this._toastWrp.info(err.message, ToastWrapper.LENGTH_LONG);
    });
  }

  /**
   * Recipe item command to copy
   * all recipe ingredients to the
   * Shopping List section.
   * @param ingredients
   * @param ev
   * @private
   */
  private _addIngredientsToShoppingList(ingredients:Ingredient[], ev):void{
    ev.stopPropagation();

    let self = this;
    this._shoppingListSrv.addIngredients(ingredients,(err)=>{
      if(!err)
        self._toastWrp.info(
          `${ingredients.length} ingredients added to shopping list.`,
          ToastWrapper.LENGTH_SHORT
        );
      else
        self._toastWrp.warn(err.message);
    });
  }

  /**
   * UI utility to display labels
   * over values.
   * @param value
   * @private
   */
  private _getDifficultyOptionLabel(value:number):string{
    return RecipeDifficultyOptions.options.find(o=>o.value==value).label;
  }

}
