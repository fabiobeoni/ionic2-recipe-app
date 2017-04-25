/**
 *Since this utils doesn't cast nested objects
 *would be better to replace it with a model
 *to Json mapper library working with annotations
 *but it's OK for the purposes of this sample app.
 */
export class JsonCast {

  static castOne<T>(json:any,type:any):T{
    return Object.assign(new type(),json) as T;
  }

  static castMany<T>(json:any,type:any):T[]{
    let casted = (json as Array<Object>).map((item)=>{
      return Object.assign(new type(), item);
    });

    return casted as T[];
  }
}
