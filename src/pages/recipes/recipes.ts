import { Component } from '@angular/core';
import {RecipeEditPage} from "../recipe-edit/recipe-edit";


@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipeEditPage = RecipeEditPage;


}
