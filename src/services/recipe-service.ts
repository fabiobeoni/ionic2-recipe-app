import {Recipe} from "../models/recipe";
import {Storage} from '@ionic/storage';

export class RecipeService{

  private readonly RECIPES_KEY = 'recipes';

  private recipes:Recipe[] = [];
  private storage:Storage;

  constructor(){
    this.storage = new Storage({name:'dbname'});
  }

  getRecipes(callback:(recipes:Recipe[])=>void):void{
    let self = this;
    this.storage.get(this.RECIPES_KEY)
      .then(data => {
        if(data) self.recipes = data;

        callback(self.recipes.slice());
      })
      .catch(err=>{
        console.error(err);
        callback(self.recipes.slice());
      });
  }

  getNewRecipe():Recipe{
    return Recipe.factory();
  }

  addRecipe(recipe:Recipe,callback:(result:boolean)=>void):void {
    let self = this;
    let exists = this.recipes.find(o=>o.title.trim().toLocaleLowerCase()==recipe.title.trim().toLocaleLowerCase());
    if(!exists){
      this.recipes.push(recipe);
      this.save(saved=>{
        if(!saved) //rollback locally
          self.recipes.splice(self.recipes.indexOf(recipe),1);

        callback(saved);
      });
    }
  }

  removeRecipe(recipe:Recipe,callback: (result: boolean) => void):void{
    let index = this.recipes.findIndex(o=>o.title.toLowerCase()==recipe.title.toLowerCase());
    //this.recipes.splice(index,1);
  }

  private save(callback: (saved: boolean) => void) {
    this.storage.set(this.RECIPES_KEY, this.recipes)
      .then(data => {
        callback(true);
      })
      .catch(err=>{
        console.error(err);
        callback(false);
      });
  }
}
