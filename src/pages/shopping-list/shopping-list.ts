import { Component } from '@angular/core';
import {Ingredient} from "../../models/ingradient";
import {ShoppingListService} from "../../services/shopping-list-service";
import {ToastController} from "ionic-angular";


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {

  ui = {
    displayForm:false
  };

  ingredient:Ingredient = this.shoppingListSrv.getNewIngredient();
  ingredients:Ingredient[] = [];

  constructor(private shoppingListSrv:ShoppingListService, private toastCtrl:ToastController){
    console.log("Shopping list loaded...");
  }

  ionViewWillEnter(){
    this.loadIngredients();
  }

  loadIngredients(){
    this.ingredients = this.shoppingListSrv.getIngredients();
  }

  addIngredient(){
    let result:boolean = this.shoppingListSrv.addIngredient(this.ingredient);

    let message = {
      text:'',
      class:''
    };

    if(result){
      this.ingredient = this.shoppingListSrv.getNewIngredient();
      this.loadIngredients(); //reloads the list to show the update

      message.text = 'Ingredient added';
      message.class = 'toast_success';
    }
    else{
      message.text = 'Ingredient is already available in the list';
      message.class = 'toast_warn';
    }

   this.toastCtrl.create({
       message: message.text,
       duration: 3000,
       position: 'top',
       cssClass:message.class
   }).present();
  }

  removeIngredient(ingredient:Ingredient){
    this.shoppingListSrv.removeIngredient(ingredient);
    this.loadIngredients();
  }

}
