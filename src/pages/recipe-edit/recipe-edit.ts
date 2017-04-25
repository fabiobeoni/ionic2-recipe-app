import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController, Alert, NavController} from 'ionic-angular';
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ModelValidationService} from "../../services/model-validation-service";
import {Ingredient} from "../../models/ingradient";
import {ToastWrapper} from "../../utils/toast-wrp";
import {RecipeDifficultyOptions} from "../recipe-difficulty-options";

@Component({
  selector: 'page-recipe-edit',
  templateUrl: 'recipe-edit.html'
})
export class RecipeEditPage implements OnInit{

  static Modes = {
    EDIT:'Edit',
    ADD:'New'
  };

  private _difficultyOptions = RecipeDifficultyOptions;
  private _mode = RecipeEditPage.Modes.ADD;
  private _recipe:Recipe;
  private _ingredientsAlert:Alert;

  private get difficultyOptions(): any {
    return this._difficultyOptions.options;
  }

  constructor(
    public _navParams: NavParams,
    private _navCtrl:NavController,
    private _actionSheetCtrl:ActionSheetController,
    private _alertCtrl:AlertController,
    private _toastWrp: ToastWrapper,
    private _recipeSrv:RecipeService,
    private _validatorSrv:ModelValidationService
  ) {}

  //todo: check why ionWillEnter does't fire (this page is open by nav-push)
  ngOnInit(){
    if(this._navParams.data.recipe){
      this._mode = RecipeEditPage.Modes.EDIT;
      this._recipe=this._navParams.data.recipe;
    }
    else
      this._recipe = this._recipeSrv.getNewRecipe();
  }

  private save(){
    if(this._mode==RecipeEditPage.Modes.ADD)
      this._recipeSrv.addRecipe(this._recipe,(err:Error)=>{
        this.displaySavingMessage(err)
      });
    else
      this._recipeSrv.updateRecipe(this._recipe,(err:Error)=>{
        this.displaySavingMessage(err)
      });
  }

  private removeRecipe():void{
    this._recipeSrv.removeRecipe(this._recipe,(err:Error)=>{
      if(err)
        this._toastWrp.info(err.message);
      else
        this._navCtrl.pop();
    });
  }

  private displayIngredientMenu(){
    let actionSheet = this._actionSheetCtrl.create({
      title:'Select',
      buttons:[
        {
          text:'Add Ingredient',
          handler:()=>{this.displayIngredientAlert();}
        },
        {
          text:'Remove all Ingredients',
          role:'destructive',
          handler:()=>{this.displayDeleteConfirmAlert();}
        },
        {
          text:'Cancel',
          role:'cancel',
          handler:()=>{actionSheet.dismiss();}
        },
      ]
    });
    actionSheet.present();
  }

  private addIngredient(name,amount):void {
    let count:number = this._recipe.ingredients.length;
    let newIngredient:Ingredient = Ingredient.factory(name,amount);

    this._recipeSrv.addIngredient(this._recipe, newIngredient, (err:Error)=>{
      if(err) this._ingredientsAlert.setSubTitle(err.message);
      else if(count<this._recipe.ingredients.length)
        this._ingredientsAlert.dismiss();
    });
  }

  private deleteAllIngredients():void{
    this._recipeSrv.removeAllIngredients(this._recipe);
    this._toastWrp.info('All ingredients deleted',ToastWrapper.LENGTH_SHORT);
  }

  private displayIngredientAlert(){
    this._ingredientsAlert = this._alertCtrl.create({
      title:'Ingredients',
      inputs:[
        {
          name:'name',
          placeholder:'Name'
        },
        {
          name:'amount',
          placeholder:'Amount',
          type:'number'
        }
      ],
      buttons:[
        {
          text:'Close',
          role:'cancel'
        },
        {
          text:'Add',
          handler: data => {
            this.addIngredient(data.name,parseInt(data.amount));
            return false;
          }
        }
      ]
    });

    this._ingredientsAlert.present();
  }

  private displayDeleteConfirmAlert(){
    let confirm = this._alertCtrl.create({
      title: 'Please confirm deleting',
      message: 'Do you really want to delete all ingredients? Action cannot be un-do.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { confirm.dismiss(); }
        },
        {
          text: 'Yes, delete',
          handler: () => {this.deleteAllIngredients();}
        }
      ]
    });
    confirm.present();
  }

  private displaySavingMessage(err:Error){
    let message:string = 'Recipe saved';
    if(err) {
      message = err.message;
      this._toastWrp.info(message);
    }
    else{
      this._toastWrp.info(message);
      this._navCtrl.pop();
    }
  }

}
