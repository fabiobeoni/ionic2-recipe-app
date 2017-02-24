import {ValidationErrorInterface} from "validator.ts/ValidationErrorInterface";
import {Validator} from "validator.ts/Validator";

export class ModelValidationService{

  private _validator:Validator;
  private _skipMissingProperties:true;
  private _errors:ValidationErrorInterface[]=[];

  get errors(): ValidationErrorInterface[] {
    return this._errors;
  }

  get skipMissingProperties(): any {
    return this._skipMissingProperties;
  }

  set skipMissingProperties(value: any) {
    this._skipMissingProperties = value;
  }

  constructor(){
    this._validator =  new Validator();
  }

  sanitizeAndValidate(model:Object):ValidationErrorInterface[]{
    this._errors =  this._validator.sanitizeAndValidate(model, { skipMissingProperties: this._skipMissingProperties });
    return this._errors;
  }

  isValid(model:Object):boolean{
   this._errors = this._validator.validate(model,{ skipMissingProperties: this._skipMissingProperties });
   return (this._errors.length>0);
  }

  errorMessage(field:string):string{
    let _error = this._errors.find(o=>o.property.toLowerCase()==field.toLowerCase());
    let message = '';
    if(_error)
      message = _error.errorMessage;

    return message
  }
}
