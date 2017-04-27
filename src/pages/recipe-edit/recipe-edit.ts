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

  /**
   * This component can work in two modes:
   * 1. editing an existing recipe
   * 2. creating a new one
   * This param is passed when moving
   * from the recipes list page to
   * this one.
   * @type {{EDIT: string; ADD: string}}
   */
  static Modes = {
    EDIT:'Edit',
    ADD:'New'
  };

  /**
   * Default mode to open this
   * page for editing.
   * @type {string}
   * @private
   */
  private _mode = RecipeEditPage.Modes.ADD;

  /**
   * View model object to host the
   * editing recipe.
   */
  private _recipe:Recipe;

  /**
   * Alert displayed to manage
   * ingredients of the editing
   * recipe.
   */
  private _ingredientsAlert:Alert;

  //UI utility
  private get _difficultyOptions(): any {
    return RecipeDifficultyOptions.options;
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
  /**
   * Initialize the editing form
   * by filling a new recipe object
   * or the one selected by the
   * user in the recipes list.
   */
  ngOnInit(){
    if(this._navParams.data.recipe){
      this._mode = RecipeEditPage.Modes.EDIT;
      this._recipe=this._navParams.data.recipe;
    }
    else
      this._recipe = this._recipeSrv.getNewRecipe();
  }

  /**
   * Add or update the editing
   * recipe and save it on
   * database.
   */
  private _save(){
    if(this._mode==RecipeEditPage.Modes.ADD)
      this._recipeSrv.addRecipe(this._recipe,(err:Error)=>{
        this._displaySavingMessage(err)
      });
    else
      this._recipeSrv.updateRecipe(this._recipe,(err:Error)=>{
        this._displaySavingMessage(err)
      });
  }

  /**
   * Save callback. Message to the user
   * and move back to recipes list
   * when everything is OK.
   * @param err
   */
  private _displaySavingMessage(err:Error){
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

  /**
   * Remove the editing recipe
   * from the list of recipes,
   * save the update on
   * database, and bring the
   * user back to the recipes
   * list page.
   */
  private _removeRecipe():void{
    this._recipeSrv.removeRecipe(this._recipe,(err:Error)=>{
      if(err)
        this._toastWrp.info(err.message);
      else
        this._navCtrl.pop();
    });
  }

  /**
   * Add a new ingredient to the recipe.
   * When a model validation error occurs
   * the error message displays on a
   * alert subtitle.
   * Save must be invoked by the user.
   * @param name
   * @param amount
   */
  private _addIngredient(name, amount):void {
    let count:number = this._recipe.ingredients.length;
    let newIngredient:Ingredient = Ingredient.factory(name,amount);

    this._recipeSrv.addIngredient(this._recipe, newIngredient, (err:Error)=>{
      if(err)
        this._ingredientsAlert.setSubTitle(err.message);
      else if(count<this._recipe.ingredients.length)
        this._ingredientsAlert.dismiss();
    });
  }

  /**
   * Deletes all ingredients from
   * the editing recipe.
   * Save must be invoked by the user.
   */
  private _deleteAllIngredients():void{
    this._recipeSrv.removeAllIngredients(this._recipe);
    this._toastWrp.info('All ingredients deleted',ToastWrapper.LENGTH_SHORT);
  }

  /**
   * Display the ingredient menu
   * (an ActionSheet) to the user
   * to select an action to perform:
   * 1. Add new ingredient to the recipe
   * 2. Remove all ingredients from the recipe
   * 3. Cancel
   */
  private _displayIngredientMenu(){
    let actionSheet = this._actionSheetCtrl.create({
      title:'Select',
      buttons:[
        {
          text:'Add Ingredient',
          handler:()=>{this._displayIngredientAlert();}
        },
        {
          text:'Remove all Ingredients',
          role:'destructive',
          handler:()=>{this._displayDeleteConfirmAlert();}
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

  /**
   * Display the ingredient editing
   * alert window to add a new
   * ingredient to the recipe.
   */
  private _displayIngredientAlert(){
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
            this._addIngredient(data.name,parseInt(data.amount));
            return false;
          }
        }
      ]
    });

    this._ingredientsAlert.present();
  }

  /**
   * Display a delete confirm alert
   * to the user since his deleting
   * all ingredients at once. Then
   * deletes if confirmed.
   */
  private _displayDeleteConfirmAlert(){
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
          handler: () => {this._deleteAllIngredients();}
        }
      ]
    });
    confirm.present();
  }

}
