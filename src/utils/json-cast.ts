/**
 *Since this utils doesn't cast nested objects
 *would be better to replace it with a model
 *to Json mapper library working with annotations,
 *but it's OK for the purposes of this sample app.
 * TODO: replace with JSON serialization based on annotations on model class
 */
export class JsonCast {

  /**
   * Casts the given json object to the
   * given type. Note: casting is not recursive
   * to childs.
   * @param json
   * @param type
   * @returns {T}
   */
  static castOne<T>(json:any,type:any):T{
    return Object.assign(new type(),json) as T;
  }

  /**
   * Casts the given json object array to the
   * given type. Note: casting is not recursive
   * to childs.
   * @param json
   * @param type
   * @returns {T}
   */
  static castMany<T>(json:any,type:any):T[]{
    let casted = (json as Array<Object>).map((item)=>{
      return Object.assign(new type(), item);
    });

    return casted as T[];
  }
}
