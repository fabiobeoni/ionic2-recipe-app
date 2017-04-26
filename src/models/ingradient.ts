import {IsPositive, Length} from "class-validator";

/**
 * Model class describing an "ingredient" of a "recipe".
 * Since this app is a sample this model only has two
 * fields, and the "amount" field is number of a not
 * defined unit of measure (to avoid internationalization
 * issues on this sample).
 */
export class Ingredient{

  /**
   * Helper method, up to now doesn't have
   * a complex initialization logic ;)
   * @param name
   * @param amount
   * @returns {Ingredient}
   */
  static factory(name:string,amount:number):Ingredient{
    return new Ingredient(name,amount);
  }

  constructor(_name:string,_amount:number){
    this.name = _name;
    this.amount = _amount;
  }

  /**
   * Name of the ingredient. Will be unique
   * in a recipe.
   */
  @Length(1,100,{message:'"Name" is invalid (1 to 100 digits)'})
  name:string;

  /**
   * How much quantitative you need of it
   */
  @IsPositive({message:'"Amount" is invalid (>0)'})
  amount:number;
}
