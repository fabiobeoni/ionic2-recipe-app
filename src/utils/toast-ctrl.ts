import {ToastController} from "ionic-angular";

export class ToastCtrl extends ToastController {
  public static LENGTH_SHORT:number = 3000;
  public static LENGTH_MEDIUM:number = 5000;
  public static LENGTH_LONG:number = 80000;

  public info(msg:string,length:number):void{
    this.create({
      message:msg,
      duration:length
    }).present();
  }
}
