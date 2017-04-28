import {Recipe} from "../models/recipe";
import {Storage} from '@ionic/storage';
import {ModelValidationService} from "./model-validation-service";
import {Ingredient} from "../models/ingradient";
import {Injectable} from "@angular/core";
import {JsonCast} from "../utils/json-cast";
import {IonicStorageWrapperService} from "./ionic-storage-wrapper-service";

/**
 * Provides a service to manage
 * recipe data and perform CRUD
 * operations over a database
 * using Ionic Storage.
 */
@Injectable()
export class RecipeService{

  /**
   * Table name for recipes data in Storage.
   * @type {string}
   */
  private readonly RECIPES_KEY = 'recipes';

  /**
   * Local copy of recipes read from db
   * @type {Array}
   * @private
   */
  private _recipes:Recipe[] =[];

  /**
   * Instance of the Ionic Storage
   */
  private _storage:Storage;

  //TODO: in Ionic docs they say that the Storage should not be manually initialized, but instead injected.
  //But I could not make it working by injection... check why.
  constructor(
    private validator:ModelValidationService,
    private storageWrp:IonicStorageWrapperService)
  {
    this._storage = storageWrp.storage;
  }

  /**
   * Loads all recipes data from
   * the database.
   * @param callback
   */
  getRecipes(callback:(recipes:Recipe[],err:Error)=>void):void{
    let srv = this;
    this._storage.get(this.RECIPES_KEY)
      .then(data => {
        if(data) srv._recipes = (JsonCast.castMany<Recipe>(data,Recipe));

        callback(srv._recipes.slice(),null);
      })
      .catch(err=>{
        console.error(err);
        callback(null,err);
      });
  }

  /**
   * Creates a new recipe for editing.
   * @returns {Recipe}
   */
  getNewRecipe():Recipe{
    return Recipe.factory();
  }

  /**
   * Set allrecipes into the
   * list and saves it to the database.
   * @param recipes
   * @param callback
   */
  setRecipes(recipes:Recipe[], callback:(err:Error)=>void){
    this._recipes = recipes;
    this.save(callback);
  };

  /**
   * Validate and add a recipe to the list
   * and saves in the database.
   * If saving throws an error,
   * the local list is rolled-back.
   * @param recipe
   * @param callback
   */
  addRecipe(recipe:Recipe,callback:(err:Error)=>void):void {
    let srv = this;
    this.validator.whenValid(recipe,
      //success callback
      ()=> {
        let exists = srv._recipes.find(o=>o.id==recipe.id);
        if(!exists){
          srv._recipes.push(recipe);

          //stores data on with storage
          srv.save(err=>{
            if(err) //rollback locally
              srv._recipes.splice(srv._recipes.indexOf(recipe),1);

            callback(err);
          });
        }
      },
      //fail callback
      callback
    );
  }

  /**
   * Validates and updates the current editing
   * recipe, then saves changes to the database.
   * @param recipe
   * @param callback
   */
  updateRecipe(recipe:Recipe,callback:(err:Error)=>void):void {
    let srv = this;
    this.validator.whenValid(recipe,
      //success callback
      ()=> {srv.save(callback);},
      //fail callback
      callback
    );
  }

  /**
   * Validates and removes the current editing
   * recipe, then saves changes to the database.
   * When saving throws an error, the local list
   * is rolled-back.
   * @param recipe
   * @param callback
   */
  removeRecipe(recipe:Recipe,callback: (err: Error) => void):void{
    let srv = this;
    let index = this._recipes.findIndex(o=>o.id==recipe.id);
    this._recipes.splice(index,1);
    this.save(err=>{
      if(err) //rollback locally
        srv._recipes.push(recipe);

      callback(err);
    });
  }

  /**
   * Validates and add the editing
   * ingredient to the current recipe.
   * Data are not saved unless the user
   * saves the recipe explicitly.
   * @param recipe
   * @param ingredient
   * @param callback
   */
  addIngredient(recipe:Recipe,ingredient:Ingredient,callback:(err:Error)=>void):void{
    this.validator.whenValid(ingredient,
      //success callback
      ()=>{
        let found = recipe.ingredients.find(o=>o.name==name);
        if(!found)
          recipe.ingredients.push(ingredient);
        else
          callback(new Error('Ingredient is already available in the list.'));
      },

      //fail callback
      callback
    );
  }

  /**
   * Removes all ingredients from the
   * current recipe.
   * Data are not saved unless the user
   * saves the recipe explicitly.
   * @param recipe
   * @param ingredient
   * @param callback
   */
  removeAllIngredients(recipe:Recipe):void{
    recipe.ingredients = [];
  }

  /**
   * Saves changes to the database.
   * @param callback
   */
  private save(callback: (err:Error) => void):void {
    this._storage.set(this.RECIPES_KEY, this._recipes)
      .then(data => {
        callback(null);
      })
      .catch(err=>{
        console.error(err);
        callback(err);
      });
  }
}
