import {Recipe} from "../models/recipe";

export class RecipeDifficultyOptions {

  static get options(): any[] {
    return this._options;
  }

  private static _options:any[]= [
    {
      label:'Easy',
      value:Recipe.Difficulties.EASY
    },
    {
      label:'Medium',
      value:Recipe.Difficulties.MEDIUM
    },
    {
      label:'Difficult',
      value:Recipe.Difficulties.DIFFICULT
    }
  ];


}
