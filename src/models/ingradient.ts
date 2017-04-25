
import {IsPositive, Length} from "class-validator";

export class Ingredient{

  static factory(name:string,amount:number):Ingredient{
    return new Ingredient(name,amount);
  }

  constructor(_name:string,_amount:number){
    this.name = _name;
    this.amount = _amount;
  }

  @Length(1,100,{message:'"Name" is invalid (1 to 100 digits)'})
  name:string;

  @IsPositive({message:'"Amount" is invalid (>0)'})
  amount:number;
}
