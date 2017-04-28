import {ValidationError, Validator} from "class-validator";

/**
 * Model validation service that works
 * with "class-validator" library.
 * Provides utility methods to validate
 * the model and present validation
 * messages to the user on view.
 */
export class ModelValidationService{

  /**
   * Instance of the real Validator
   * from class-validator lib.
   */
  private _validator:Validator;

  /**
   * List of errors populated after
   * invoking the .validate() method.
   * @type {Array}
   * @private
   */
  private _errors:ValidationError[]=[];

  /**
   * List of errors populated after
   * invoking the .validate() method.
   * By default it's empty array.
   * @type {Array}
   * @private
   */
  get errors(): ValidationError[] {
    return this._errors;
  }

  constructor(){
    this._validator =  new Validator();
  }

  /**
   * Validate the given model object
   * according to model validation
   * annotations.
   * When there are errors, the local
   * list of errors is populated, and
   * you can read them by the .errors
   * property.
   * Callback signatures returns
   * a boolean.
   * @param model
   * @param callback
   */
  validate(model:Object,callback:(isValid:boolean)=>void):void{
    this._validator.validate(model, { skipMissingProperties: false })
      .then(errors=>{
        this._errors = errors;
        callback(this._errors.length==0);
      });
  }

  /**
   * Utility to invoke different
   * callbacks according to the
   * validation result.
   * The fail callback returns
   * a string with all errors on it.
   * @param model
   * @param success
   * @param fail
   */
  whenValid(model:Object, success:()=>void,fail:(err:Error)=>void){
    this.validate(model,(isValid => {
      isValid ? success() : fail(new Error(this._errorsToString()));
    }));
  }

  /**
   * Utility to display on a UI form
   * validation messages field by field
   * according to model class properties.
   * @param fieldName
   * @returns {string}
   */
  messageFor(fieldName:string):string{
    let messages:string[]=[];
    let error = this._errors.find(o=>o.property.toLowerCase()==fieldName.toLowerCase());
    if(error)
      for(let constrain in error.constraints)
        messages.push(error.constraints[constrain]);

    return messages.join('\n\r');
  }

  /**
   * Returns a string with all
   * validation messages returned
   * by the .validate() method.
   * @returns {string}
   * @private
   */
  private _errorsToString():string{
    let messages:string[]=[];
    for(let error of this.errors)
      for(let constrain in error.constraints)
        messages.push(error.constraints[constrain]);

    return messages.join('\n\r');
  }
}
