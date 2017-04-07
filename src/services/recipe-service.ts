import {Recipe} from "../models/recipe";
import {Storage} from '@ionic/storage';
import {AppModule} from "../app/app.module";


export class RecipeService{

  private readonly RECIPES_KEY = 'recipes';

  private recipes:Recipe[] = [];
  private storage:Storage;

  constructor(){
    this.storage = new Storage({name:AppModule.DB_NAME});
  }

  getRecipes(callback:(recipes:Recipe[],err:Error)=>void):void{
    this.storage.get(this.RECIPES_KEY)
      .then(data => {
        if(data) this.recipes = data;

        callback(this.recipes.slice(),null);
      })
      .catch(err=>{
        console.error(err);
        callback(this.recipes.slice(),err);
      });
  }

  getNewRecipe():Recipe{
    return Recipe.factory();
  }

  addRecipe(recipe:Recipe,callback:(err:Error)=>void):void {
    let exists = this.recipes.find(o=>o.title.trim().toLocaleLowerCase()==recipe.title.trim().toLocaleLowerCase());
    if(!exists){
      this.recipes.push(recipe);
      this.save(err=>{
        if(err) //rollback locally
          this.recipes.splice(this.recipes.indexOf(recipe),1);

        callback(err);
      });
    }
  }

  removeRecipe(recipe:Recipe,callback: (err: Error) => void):void{
    let index = this.recipes.findIndex(o=>o.title.toLowerCase()==recipe.title.toLowerCase());
    this.recipes.splice(index,1);
    this.save(err=>{
      if(err) //rollback locally
        this.recipes.push(recipe);

      callback(err);
    });
  }

  private save(callback: (err:Error) => void) {
    this.storage.set(this.RECIPES_KEY, this.recipes)
      .then(data => {
        callback(null);
      })
      .catch(err=>{
        console.error(err);
        callback(err);
      });
  }
}
