import {Recipe} from "../models/recipe";
import {Storage} from '@ionic/storage';
import {AppModule} from "../app/app.module";
import {ModelValidationService} from "./model-validation-service";
import {Ingredient} from "../models/ingradient";
import {Injectable} from "@angular/core";
import {JsonCast} from "../utils/json-cast";

@Injectable()
export class RecipeService{

  private readonly RECIPES_KEY = 'recipes';

  private _recipes:Recipe[] =[];
  private _storage:Storage;

  constructor(private validator:ModelValidationService){
    this._storage = new Storage({name:AppModule.DB_NAME});
  }

  getRecipes(callback:(recipes:Recipe[],err:Error)=>void):void{
    let srv = this;
    this._storage.get(this.RECIPES_KEY)
      .then(data => {
        if(data) srv._recipes = (JsonCast.castMany<Recipe>(data,Recipe));

        callback(srv._recipes.slice(),null);
      })
      .catch(err=>{
        console.error(err);
        callback(srv._recipes.slice(),err);
      });
  }

  getNewRecipe():Recipe{
    return Recipe.factory();
  }

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

  updateRecipe(recipe:Recipe,callback:(err:Error)=>void):void {
    let srv = this;
    this.validator.whenValid(recipe,
      //success callback
      ()=> {srv.save(callback);},
      //fail callback
      callback
    );
  }

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

  removeAllIngredients(recipe:Recipe):void{
    recipe.ingredients = [];
  }

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
