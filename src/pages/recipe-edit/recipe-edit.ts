import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController, ToastController, Alert, NavController} from 'ionic-angular';
import {Difficulties} from "../../models/recipe-difficulties";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ModelValidationService} from "../../services/model-validation-service";
import {Ingredient} from "../../models/ingradient";
import {ToastCtrl} from "../../utils/toast-ctrl";

@Component({
  selector: 'page-recipe-edit',
  templateUrl: 'recipe-edit.html'
})
export class RecipeEditPage implements OnInit {

  static Modes = {
    EDIT:'Edit',
    ADD:'New'
  };

  mode = RecipeEditPage.Modes.ADD;

  options:any[]= [
    {
      label:'Easy',
      value:Difficulties.EASY
    },
    {
      label:'Medium',
      value:Difficulties.MEDIUM
    },
    {
      label:'Difficult',
      value:Difficulties.DIFFICULT
    }
  ];

  recipe:Recipe;

  private ingredientsAlert:Alert;

  constructor(
    public navParams: NavParams,
    private navCtrl:NavController,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController,
    private toastCtrl: ToastCtrl,
    private recipeSrv:RecipeService,
    public validator:ModelValidationService //used in UI
  ) {}

  ngOnInit(){
    if(this.navParams.data.recipe){
      this.mode = RecipeEditPage.Modes.EDIT;
      this.recipe=this.navParams.data.recipe;
    }
    else{
      this.recipe = this.recipeSrv.getNewRecipe();
    }
  }

  save(){
    if(this.mode==RecipeEditPage.Modes.ADD)
      this.recipeSrv.addRecipe(this.recipe,(err:Error)=>{
        this.displaySavingMessage(err)
      });
    else
      this.recipeSrv.updateRecipe(this.recipe,(err:Error)=>{
        this.displaySavingMessage(err)
      });
  }

  removeRecipe():void{
    this.recipeSrv.removeRecipe(this.recipe,(err:Error)=>{
      if(err)
        this.toastCtrl.info(err.message,ToastCtrl.LENGTH_MEDIUM);
      else
        this.navCtrl.pop();
    });
  }

  displayIngredientMenu(){
    let actionSheet = this.actionSheetCtrl.create({
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
    let count:number = this.recipe.ingredients.length;
    let newIngredient:Ingredient = Ingredient.factory(name,amount);

    this.recipeSrv.addIngredient(this.recipe, newIngredient, (err:Error)=>{
      if(err) this.ingredientsAlert.setSubTitle(err.message);
      else if(count<this.recipe.ingredients.length)
        this.ingredientsAlert.dismiss();
    });
  }

  private deleteAllIngredients():void{
    this.recipeSrv.removeAllIngredients(this.recipe);
    this.toastCtrl.info('All ingredients deleted',ToastCtrl.LENGTH_SHORT);
  }

  private displayIngredientAlert(){
    this.ingredientsAlert = this.alertCtrl.create({
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
          text:'Cancel',
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

    this.ingredientsAlert.present();
  }

  private displayDeleteConfirmAlert(){
    let confirm = this.alertCtrl.create({
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
      this.toastCtrl.info(message,ToastCtrl.LENGTH_MEDIUM);
    }
    else{
      this.toastCtrl.info(message,ToastCtrl.LENGTH_MEDIUM);
      this.navCtrl.pop();
    }
  }

}
