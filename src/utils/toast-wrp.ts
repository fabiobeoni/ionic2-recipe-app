import {ToastController} from "ionic-angular";

export class ToastWrapper extends ToastController {
  public static LENGTH_SHORT:number = 3000;
  public static LENGTH_MEDIUM:number = 5000;
  public static LENGTH_LONG:number = 80000;
  private static SUCCESS_CLASS:string='toast_success';
  private static WARN_CLASS:string='toast_warn';

  public info(msg:string,length?:number):void{
    this.make(ToastWrapper.SUCCESS_CLASS, msg, length);
  }
  public warn(msg:string,length?:number):void{
    this.make(ToastWrapper.WARN_CLASS,msg, length);
  }

  private make(cssClass:string, msg: string, length?: number):void {
    this.create({
      message: msg,
      duration: length || ToastWrapper.LENGTH_MEDIUM,
      cssClass: cssClass
    }).present();
  }
}
