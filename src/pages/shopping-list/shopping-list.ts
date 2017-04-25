import { Component } from '@angular/core';
import {Ingredient} from "../../models/ingradient";
import {ShoppingListService} from "../../services/shopping-list-service";
import {ToastController} from "ionic-angular";
import {ModelValidationService} from "../../services/model-validation-service";
import {ToastWrapper} from "../../utils/toast-wrp";


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html'
})
export class ShoppingListPage {

  private _ui = {
    displayForm:false,
    isModelValid:false
  };

  private _ingredient:Ingredient;
  private _ingredients:Ingredient[]=[];

  constructor(
    private _shoppingListSrv:ShoppingListService,
    private _validatorSrv:ModelValidationService,
    private _toastWrp:ToastWrapper)
  {
    this._ingredient = this._shoppingListSrv.getNewIngredient();
  }

  ionViewWillEnter(){
    this.loadIngredients();
  }

  private loadIngredients(){
    this._ingredients = this._shoppingListSrv.getIngredients();
  }

  private addIngredient(){
    let self = this;

    //forces the cast to number, for some reason the input form
    //returns "amount" as string, even if the model field is
    //type number and the <input> type is number too.
    this._ingredient.amount = parseInt(this._ingredient.amount.toString());

    this._validatorSrv.whenValid(this._ingredient, ()=>{
        self._ui.isModelValid = true;
        let result:boolean = this._shoppingListSrv.addIngredient(this._ingredient);
        let message:string;

        if(result){
          this._ingredient = this._shoppingListSrv.getNewIngredient();
          this.loadIngredients(); //reloads the list to show the update

          message = 'Ingredient added';
          this._toastWrp.info(message);
        }
        else{
          message = 'Ingredient is already available in the list';
          this._toastWrp.warn(message);
        }
      },
      err=>{/*alredy logged*/}
      );
  }

  private removeIngredient(ingredient:Ingredient){
    this._shoppingListSrv.removeIngredient(ingredient);
    this.loadIngredients();
  }


}
