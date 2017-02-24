import {Ingredient} from "./ingradient";
import {Difficulties} from "./recipe-difficulties";
import {IsLength, MinSize, MaxSize} from "validator.ts/decorator/Validation";
import {Escape} from "validator.ts/decorator/Sanitization";

//TODO: localize messages, keep here message keys instead of real text
export class Recipe {

    @IsLength(1,100, {message:'(Required, maximum 100 digits)'})
    @Escape()
    public title:String;

    @IsLength(1,2000, {message:'(Required, maximum 2000 digits)'})
    @Escape()
    public description:String;

    @MinSize(Difficulties.EASY)
    @MaxSize(Difficulties.DIFFICULT)
    public difficulty:number = Difficulties.EASY;

    public ingredients:Ingredient[] = [];

    static factory(){
      return new Recipe();
    }

}

