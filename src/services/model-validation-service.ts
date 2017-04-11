
import {ValidationError, Validator} from "class-validator";

export class ModelValidationService{

  private _validator:Validator;
  private _errors:ValidationError[]=[];

  get errors(): ValidationError[] {
    return this._errors;
  }

  constructor(){
    this._validator =  new Validator();
  }

  validate(model:Object,callback:(isValid:boolean)=>void):void{
    this._validator.validate(model, { skipMissingProperties: false })
      .then(errors=>{
        this._errors = errors;
        callback(this._errors.length==0);
      });
  }


  public whenValid(model:Object, success:()=>void,fail:(err:Error)=>void){
    this.validate(model,(isValid => {
      isValid ? success() : fail(new Error(this.errorsToString()));
    }));
  }

  messageFor(field:string):string{
    let messages:string[]=[];
    let error = this._errors.find(o=>o.property.toLowerCase()==field.toLowerCase());
    if(error)
      for(let constrain in error.constraints)
        messages.push(error.constraints[constrain]);

    return messages.join('\n\r');
  }

  errorsToString():string{
    let messages:string[]=[];
    for(let error of this.errors)
      for(let constrain in error.constraints)
        messages.push(error.constraints[constrain]);

    return messages.join('\n\r');
  }
}
