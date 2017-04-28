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

  private _ingredients:any[] = [];

  private _storage:Storage;

  constructor(private storageWrp:IonicStorageWrapperService){
    this._storage = storageWrp.storage;
  }

  getIngredients():Ingredient[]{
    return this._ingredients.slice();
  }

  /*
  getIngredients(callback:(recipes:Ingredient[],err:Error)=>void):void{
    let srv = this;
    this._storage.get(this.SHOPPING_LIST_KEY)
      .then(data => {
        if(data) srv._ingredients = (JsonCast.castMany<Ingredient>(data,Ingredient));

        callback(srv._ingredients.slice(),null);
      })
      .catch(err=>{
        console.error(err);
        callback(null,err);
      });
  }
  */

  getNewIngredient():Ingredient{
    return Ingredient.factory('Ingredient Name',0);
  }

  getIngredientIndex(ingredient:Ingredient):number{
    return this._ingredients.findIndex(o=>o.name==ingredient.name);
  }

  /**
   * Add the given ingredient to the list if
   * the ingredient is unique in the list.
   * @param ingredient {Ingredient}
   * @returns {boolean} : false if the ingredient is already present in the list.
   */
  addIngredient(ingredient:Ingredient):boolean {
    let exists = this._ingredients.find(o=>o.name.trim().toLocaleLowerCase()==ingredient.name.trim().toLocaleLowerCase());
    if(!exists){
      this._ingredients.push(ingredient);
      return true;
    }
    else
      return false;
  }

  addIngredients(ingredients:Ingredient[]){
    this._ingredients.push(...ingredients);
  }

  removeIngredient(ingredient:Ingredient){
    let index = this.getIngredientIndex(ingredient);
    this._ingredients.splice(index,1);
  }

  /**
   * Saves changes to the database.
   * @param callback
   */
  private save(callback: (err:Error) => void):void {
    this._storage.set(this.SHOPPING_LIST_KEY, this._ingredients)
      .then(data => {
        callback(null);
      })
      .catch(err=>{
        console.error(err);
        callback(err);
      });
  }

}
