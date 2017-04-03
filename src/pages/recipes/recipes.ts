import { Component } from '@angular/core';
import {RecipeEditPage} from "../recipe-edit/recipe-edit";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipeEditPage = RecipeEditPage;

  recipes:Recipe[] = [];

  constructor(private recipeSrv:RecipeService){}

  ionViewWillEnter(){
    let self = this;
    this.recipeSrv.getRecipes(recipes => {
      debugger;
      self.recipes = recipes;
    });
  }

}
