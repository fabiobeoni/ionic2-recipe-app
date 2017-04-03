import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController, ToastController, Alert} from 'ionic-angular';
import {Difficulties} from "../../models/recipe-difficulties";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ModelValidationService} from "../../services/model-validation-service";
import {Ingredient} from "../../models/ingradient";
import {ValidationErrorInterface} from "validator.ts/ValidationErrorInterface";

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
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController,
    private toastCtrl: ToastController,
    private recipeSrv:RecipeService,
    public validator:ModelValidationService
  ) {}

  ngOnInit(){
    this.mode = this.navParams.data;
    this.recipe = this.recipeSrv.getNewRecipe();
  }

  save(){
    let self = this;
    this.validator.validate(this.recipe,(isValid:boolean)=> {
      if(isValid)
      {
        let message:string = '';
        if(self.mode==RecipeEditPage.Modes.ADD)
          this.recipeSrv.addRecipe(this.recipe,(added:boolean)=>{
            if(added) message = 'Recipe saved';
            else message = 'Error adding recipe';

            this.toastCtrl.create({
              message:message,
              duration:5000
            }).present();
          });
        else{
          //TODO: implement...
          this.toastCtrl.create({
            message:message,
            duration:5000
          }).present();
        }
      }

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
    let _this = this;
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
            _this.addIngredient(data.name,parseInt(data.amount));
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

    this.toastCtrl.create({
      message:'All recipes deleted',
      duration:3000
    }).present();
  }

}
