import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController, ToastController} from 'ionic-angular';
import {Difficulties} from "../../models/recipe-difficulties";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ModelValidationService} from "../../services/model-validation-service";
import {Ingredient} from "../../models/ingradient";
import {ValidationErrorInterface} from "validator.ts/ValidationErrorInterface";
import {ValidationError} from "class-validator";

@Component({
  selector: 'page-recipe-edit',
  templateUrl: 'recipe-edit.html'
})
export class RecipeEditPage implements OnInit {

  public static Modes = {
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
  ingredients:Ingredient[];

  constructor(
    public navParams: NavParams,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController,
    private toastCtrl: ToastController,
    private recipeSrv:RecipeService,
    public validator:ModelValidationService //used in view
  ) {}

  ngOnInit(){
    this.mode = this.navParams.data;
    this.recipe = this.recipeSrv.getNewRecipe();
    this.ingredients = [];
  }

  save(){
    this.validator.validate(this.recipe);
    //TODO: store on service
    console.log(this.recipe.toString());
  }

  onIngredientChange(event,i){
    debugger;
    let updatedIngredient:Ingredient = this.ingredients[i];
    this.validator.validate(updatedIngredient);
    if(this.validator.errors.length>0){
      this.toastCtrl.create({
        message:this.validator.errorsToString(),
        duration: 5000
      }).present();
    }
  }

  displayIngredientMenu(){
    const actSheet = this.actionSheetCtrl.create({
      title:'Select',
      buttons:[
        {
          text:'Add Ingredient',
          handler:()=>{
            this.createNewIngredientAlert().present();
          }
        },
        {
          text:'Remove all Ingredients',
          role:'destructive',
          handler:()=>{this.ingredients = [];}
        },
        {
          text:'Cancel',
          role:'cancel',
          handler:()=>{}
        },
      ]
    });

    actSheet.present();
  }

  createNewIngredientAlert(){
    let _this = this;
    const ingredientAlert = this.alertCtrl.create({
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
            return _this.addIngredient(data.name,parseInt(data.amount),ingredientAlert);
          }
        }
      ]
    });

    return ingredientAlert;
  }

  private addIngredient(name,amount,alert):boolean {
    let newIngredient:Ingredient = Ingredient.factory(name,amount);
    this.validator.validate(newIngredient);

    if(this.validator.errors.length>0){
      alert.setSubTitle(this.validator.errorsToString());
      return false;
    }

    let found = this.ingredients.find(o=>o.name==name);
      if(!found)
        this.ingredients.push(newIngredient);
      else{
        alert.setSubTitle('Ingredient is already available in the list.');
        return false;
      }

    return true;
  }

}
