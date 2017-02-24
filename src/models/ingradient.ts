export class Ingredient{

  static factory():Ingredient{
    return new Ingredient();
  }

  isValid():boolean{
    return (
      this.name!=null && this.name.trim().length>0 &&
        this.amount!=null && this.amount > 0
    );
  }

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

}
