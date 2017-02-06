import { Component } from '@angular/core';
import {Ingredient} from "../../models/ingradient";
import {ShoppingListService} from "../../services/shopping-list-service";


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {

  ingredient:Ingredient;

  constructor(private shoppingListSrv:ShoppingListService){
    this.ingredient = shoppingListSrv.getNewIngredient();
  }

  addIngredient(){
    this.shoppingListSrv.addIngredient(this.ingredient);
    this.ingredient = this.shoppingListSrv.getNewIngredient();
  }

}
