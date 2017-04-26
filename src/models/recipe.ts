import "../utils/utils";

import {Ingredient} from "./ingradient";
import {ArrayMinSize, IsNotEmpty, Length, Max, Min} from "class-validator";

/**
 * Model class representing the "recipe" to prepare.
 * The recipe can have many "ingredients" and must have at-least one of it.
 */
export class Recipe {

  private static readonly LENGTH_MESSAGE:string = '"{0}" is invalid ({1} to {2} digits)';

  /**
   * Available values for the recipe.difficulty field
   * @type {{EASY: number; MEDIUM: number; DIFFICULT: number}}
   */
  static readonly Difficulties = {
      EASY:0,
      MEDIUM:1,
      DIFFICULT:2
    };

  /**
   * Helper method to initialize the recipe
   * with the unique ID already filled-in.
   * @returns {Recipe}
   */
  static factory():Recipe{
    let recipe = new Recipe();
    recipe.id = new Date().getTime().toString();
    return recipe;
  }

  /**
   * Unique ID of the recipe in the list.
   * Uniqueness cannot be checked with
   * validation attributes, is the
   * RecipeService ensuring that.
   * ID is done with date-time number
   * for simplicity.
   */
  @IsNotEmpty()
  id:string;

  /**
   * Name or title f the recipe.
   */
  @Length(1,100, {message:Recipe.LENGTH_MESSAGE.format('Title','1','100')})
  title:string;

  /**
   * Description on how to do the recipe
   */
  @Length(1,2000, {message:Recipe.LENGTH_MESSAGE.format('Description','1','2000')})
  description:string;

  /**
   * How difficult is to make the recipe, 3 possible values
   * coming from the Recipe.Difficulties enumeration.
   * @type {number}
   */
  @Min(Recipe.Difficulties.EASY)
  @Max(Recipe.Difficulties.DIFFICULT)
  difficulty:number = Recipe.Difficulties.EASY;

  //TODO: check why is not validating when removing ingredients from existing recipe then saving
  /**
   * Ingredients needed to make the recipe.
   * One at least is required.
   * @type {Array}
   */
  @ArrayMinSize(1, {message:'Ingredients are missing'})
  ingredients:Ingredient[] = [];

}

