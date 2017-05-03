import {Ingredient} from "../models/ingradient";
import {Storage} from '@ionic/storage'
import {Injectable} from "@angular/core";
import {IonicStorageWrapperService} from "./ionic-storage-wrapper-service";
import {JsonCast} from "../utils/json-cast";

/**
 * Provides a service to manage
 * a list of ingredients to shop,
 * and perform CRUD operations
 * over a database using Ionic
 * Storage.
 */
@Injectable()
export class ShoppingListService{

  /**
   * Table name of shopping list items in database.
   * @type {string}
   */
  private readonly SHOPPING_LIST_KEY:string = 'shoppinglist';

  /**
   * Local instance of the Ionic Storage
   * service to save data on database
   */
  private _storage:Storage;

  constructor(private storageWrp:IonicStorageWrapperService){
    this._storage = storageWrp.storage;
  }

  /**
   * Reads ingredients from database
   * and returns them as typed list
   * of objects.
   * @param callback
   */
  getIngredients(callback:(ingredients:Ingredient[],err:Error)=>void):void{
    this._storage.get(this.SHOPPING_LIST_KEY)
      .then(data => {
        let ingredients:Ingredient[] = [];

        if(data)
          ingredients = (JsonCast.castMany<Ingredient>(data,Ingredient));

        callback(ingredients,null);
      })
      .catch(err=>{
        console.error(err);
        callback(null,err);
      });
  }

  /**
   * Creates a new ingredient with basic
   * initialization logic. The ingredient
   * is not saved on storage.
   * @returns {Ingredient}
   */
  getNewIngredient():Ingredient{
    return Ingredient.factory('Ingredient Name',0);
  }

  /**
   * Add the given ingredient to the list if
   * the ingredient is unique in the list.
   * Then saves the changes to the database.
   * @param ingredient {Ingredient}
   * @param ingredientsList
   * @param callback
   * @returns {boolean} : false if the ingredient is already present in the list.
   */
  addIngredient(ingredient:Ingredient,ingredientsList:Ingredient[],callback:(err:Error)=>void):void {
    let exists = ingredientsList.find(o=>o.name.trim().toLocaleLowerCase()==ingredient.name.trim().toLocaleLowerCase());
    if(!exists){
      ingredientsList.push(ingredient);
      this.save(ingredientsList,callback);
    }
    else callback(new Error(`The ingredient ${ingredient.name} is in the list already.`));
  }

  /**
   * Adds a list of ingredients to the
   * stored ingredients on database.
   * @param ingredients
   * @param callback
   */
  addIngredients(ingredients:Ingredient[],callback:(err:Error)=>void){
    let self = this;
    this.getIngredients((list,err)=>{
      if(err) return callback(err);

      list.push(...ingredients);

      self.save(list,callback);
    });
  }

  /**
   * Writes all given ingredients
   * in the database by replicing
   * any existing.
   * @param ingredients
   * @param callback
   */
  setIngredients(ingredients:Ingredient[],callback:(err:Error)=>void){
    this.save(ingredients,callback);
  }

  /**
   * Removes the given ingredient from the list
   * and saves the changes on database.
   * @param ingredient
   * @param ingredientsList
   * @param callback
   */
  removeIngredient(ingredient:Ingredient,ingredientsList:Ingredient[],callback:(err:Error)=>void){
    ingredientsList.splice(ingredientsList.findIndex(o=>o.name.toLowerCase()==ingredient.name.toLowerCase()),1);
    this.save(ingredientsList,callback);
  }

  /**
   * Saves changes to the database.
   * @param ingredients
   * @param callback
   */
  private save(ingredients:Ingredient[],callback: (err:Error) => void):void {
    this._storage.set(this.SHOPPING_LIST_KEY, ingredients)
      .then(data => {
        callback(null);
      })
      .catch(err=>{
        console.error(err);
        callback(err);
      });
  }

}
