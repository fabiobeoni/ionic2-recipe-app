export class JsonCast {

  static castOne<T>(json:any,type:any):T{
    return Object.assign(new type(),json) as T;
  }

  //
  static castMany<T>(json:any,type:any):T[]{
    let casted = (json as Array<Object>).map((item)=>{
      return Object.assign(new type(), item);
    });

    return casted as T[];
  }
}
