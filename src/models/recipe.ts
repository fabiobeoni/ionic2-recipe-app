import {Ingredient} from "./ingradient";
import {Difficulties} from "./recipe-difficulties";
import {IsString, Length, Max, Min} from "class-validator";


//TODO: localize messages, keep here message keys instead of real text
export class Recipe {

    @IsString()
    @Length(1,100, {message:'(Required, maximum 100 digits)'})
    title:String;

    @IsString()
    @Length(1,2000, {message:'(Required, maximum 2000 digits)'})
    description:String;

    @Min(Difficulties.EASY)
    @Max(Difficulties.DIFFICULT)
    difficulty:number = Difficulties.EASY;

    ingredients:Ingredient[] = [];

    static factory(){
      return new Recipe();
    }

}

