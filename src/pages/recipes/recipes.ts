import { Component } from '@angular/core';
import {RecipeEditPage} from "../recipe-edit/recipe-edit";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ToastCtrl} from "../../utils/toast-ctrl";


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipeEditPage = RecipeEditPage;

  recipes:Recipe[] = []; //

  constructor(private recipeSrv:RecipeService, private toastCtrl: ToastCtrl){}

  ionViewWillEnter(){
    this.recipeSrv.getRecipes((recipes:Recipe[],err:Error) => {
      this.recipes = recipes;

      if(err) this.toastCtrl.info(err.message,ToastCtrl.LENGTH_LONG);
    });
  }

}
