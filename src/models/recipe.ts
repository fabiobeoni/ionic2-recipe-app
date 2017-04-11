import "../utils/utils";

import {Ingredient} from "./ingradient";
import {ArrayMinSize, IsNotEmpty, Length, Max, Min} from "class-validator";


//TODO: localize messages, keep here message keys instead of real text
export class Recipe {

    private static readonly LENGTH_MESSAGE:string = '"{0}" is invalid ({1} to {2} digits)';

    static readonly Difficulties = {
      EASY:0,
      MEDIUM:1,
      DIFFICULT:2
    };

    @IsNotEmpty()
    id:string;

    @Length(1,100, {message:Recipe.LENGTH_MESSAGE.format('Title','1','100')})
    title:string;

    @Length(1,2000, {message:Recipe.LENGTH_MESSAGE.format('Description','1','2000')})
    description:string;

    @Min(Recipe.Difficulties.EASY)
    @Max(Recipe.Difficulties.DIFFICULT)
    difficulty:number = Recipe.Difficulties.EASY;

    //TODO: check why is not validating when removing ingredients from existing recipe then saving
    @ArrayMinSize(1, {message:'Ingredients are missing'})
    ingredients:Ingredient[] = [];

    static factory():Recipe{
      let recipe = new Recipe();
      recipe.id = new Date().getTime().toString();
      return recipe;
    }

}

