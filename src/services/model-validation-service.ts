
import {ValidationError, Validator} from "class-validator";

export class ModelValidationService{

  private _validator:Validator;
  private _skipMissingProperties:true;
  private _errors:ValidationError[]=[];

  get errors(): ValidationError[] {
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

  validate(model:Object):void{
    this._validator.validate(model, { skipMissingProperties: this._skipMissingProperties })
      .then(errors=>{
        this._errors = errors;
      });
  }

  isValid(model:Object):boolean{
    this.validate(model);
    return (this._errors.length==0);
  }

  fieldErrors(field:string):string[]{
    let messages:string[]=[];
    let _error = this._errors.find(o=>o.property.toLowerCase()==field.toLowerCase());
    if(_error)
      for(let msg in _error.constraints)
        messages.push(msg);

    return messages
  }

  errorsToString():string{
    let messages:string[]=[];
    for(let error of this.errors)
      for(let constrain in error.constraints)
        messages.push(error.constraints[constrain]);

    return messages.join('\n');
  }
}
