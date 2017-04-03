import "../utils/utils";

import {Ingredient} from "./ingradient";
import {Difficulties} from "./recipe-difficulties";
import {ArrayNotEmpty, IsString, Length, Max, Min, MinLength} from "class-validator";


//TODO: localize messages, keep here message keys instead of real text
export class Recipe {

    private static readonly LENGTH_MESSAGE:string = '"{0}" is invalid ({1} to {2} digits)';

    @Length(1,100, {message:Recipe.LENGTH_MESSAGE.format('Title','1','100')})
    title:String;

    @Length(1,2000, {message:Recipe.LENGTH_MESSAGE.format('Description','1','2000')})
    description:String;

    @Min(Difficulties.EASY)
    @Max(Difficulties.DIFFICULT)
    difficulty:number = Difficulties.EASY;

    @ArrayNotEmpty({message:'Ingredients are missing'})
    ingredients:Ingredient[] = [];

    static factory(){
      return new Recipe();
    }

}

