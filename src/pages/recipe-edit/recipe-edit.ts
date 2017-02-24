import {Component, OnInit} from '@angular/core';
import {NavParams, ActionSheetController, AlertController} from 'ionic-angular';
import {Difficulties} from "../../models/recipe-difficulties";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {ModelValidationService} from "../../services/model-validation-service";

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

  //TODO: replace with real Ingredient object
  ingredients:string[];

  constructor(
    public navParams: NavParams,
    private actionSheetCtrl:ActionSheetController,
    private alertCtrl:AlertController,
    private recipeSrv:RecipeService,
    public validator:ModelValidationService //used in view
  ) {}

  ngOnInit(){
    this.mode = this.navParams.data;
    this.recipe = this.recipeSrv.getNewRecipe();
    this.ingredients = [];
  }

  save(){
    //TODO: store on service
    console.log(this.recipe.toString());
  }

  onIngredientNameChange(event,i){
    this.ingredients[i] = event.target.value;
  }

  manageIngredients(){
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
            if(data.name && data.name.trim()!=''){
              let found = _this.ingredients.find(o=>o==data.name);
              if(!found)
                _this.ingredients.push(data.name);
              else{
                ingredientAlert.setSubTitle('Ingredient is already added.');
                return false;
              }
            }
            else{
              ingredientAlert.setSubTitle('Please provide an ingredient name');
              return false;
            }

          }
        }
      ]
    });

    return ingredientAlert;
  }

}
