export class Ingredient{
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }

  private _name:string;
  private _amount:number;

  static factory():Ingredient{
    return new Ingredient();
  }

}
