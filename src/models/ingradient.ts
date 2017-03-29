
import {IsInt, IsPositive, IsString, Length} from "class-validator";

export class Ingredient{

  static factory(name:string,amount:number):Ingredient{
    return new Ingredient(name,amount);
  }

  constructor(_name:string,_amount:number){
    this.name = _name;
    this.amount = _amount;
  }

  @IsString()
  @Length(1,100)
  name:string;

  @IsInt()
  @IsPositive()
  amount:number;
}
