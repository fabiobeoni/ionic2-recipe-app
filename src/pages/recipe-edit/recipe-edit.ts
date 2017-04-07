import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController, ToastController, Alert, NavController} from 'ionic-angular';
import {Difficulties} from "../../models/recipe-difficulties";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ModelValidationService} from "../../services/model-validation-service";
import {Ingredient} from "../../models/ingradient";
import {ValidationErrorInterface} from "validator.ts/ValidationErrorInterface";
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
    public validator:ModelValidationService
  ) {}

  ngOnInit(){
    if(this.navParams.data.recipe){
      this.mode = RecipeEditPage.Modes.EDIT;
      this.recipe = this.navParams.data.recipe;
    }
    else{
      this.mode = RecipeEditPage.Modes.ADD;
      this.recipe = this.recipeSrv.getNewRecipe();
    }
  }

  save(){
    this.validator.validate(this.recipe,(isValid:boolean)=> {
      if(isValid)
      {
        let message:string = '';
        if(this.mode==RecipeEditPage.Modes.ADD)
          this.recipeSrv.addRecipe(this.recipe,(err:Error)=>{
            if(!err) message = 'Recipe saved';
            else message = err.message;

            this.toastCtrl.info(message,ToastCtrl.LENGTH_MEDIUM);
            this.navCtrl.pop();
          });
        else{
          //TODO: implement...
          this.toastCtrl.info(message,ToastCtrl.LENGTH_MEDIUM);
        }
      }

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

  displayIngredientAlert(){
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

  displayDeleteConfirmAlert(){
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

  private addIngredient(name,amount):void {
    let count:number = this.recipe.ingredients.length;
    let newIngredient:Ingredient = Ingredient.factory(name,amount);

    this.validator.validate(newIngredient,(isValid:boolean)=>{
      if(isValid){
        let found = this.recipe.ingredients.find(o=>o.name==name);
        if(!found)
          this.recipe.ingredients.push(newIngredient);
        else
          this.ingredientsAlert.setSubTitle('Ingredient is already available in the list.');
      }
      else
        this.ingredientsAlert.setSubTitle(this.validator.errorsToString());

      if(count<this.recipe.ingredients.length)
        this.ingredientsAlert.dismiss();
    });
  }

  private deleteAllIngredients():void{
    this.recipe.ingredients = [];
    this.toastCtrl.info('All ingredients deleted',ToastCtrl.LENGTH_SHORT);
  }

}
