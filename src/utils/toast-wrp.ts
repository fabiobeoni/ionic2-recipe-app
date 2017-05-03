import {ToastController} from "ionic-angular";

/**
 * Utility class to save code
 * on components using toasts frequently.
 * Unlike the Ionic  ToasController this
 * utility doesn't return the toast but
 * directly displays it.
 *
 * Note: the class needs two CSS classes as follow:
 *
 * .toast_success > div {
      background-color: green !important;
    }

    .toast_warn > div {
      background-color: orange !important;
    }
 */
export class ToastWrapper extends ToastController {
  public static LENGTH_SHORT:number = 3000;
  public static LENGTH_MEDIUM:number = 5000;
  public static LENGTH_LONG:number = 80000;
  private static SUCCESS_CLASS:string='toast_success';
  private static WARN_CLASS:string='toast_warn';

  /**
   * Displays a toast message
   * with "info" styles and
   * default medium length.
   * @param msg
   * @param length
   */
  public info(msg:string,length?:number):void{
    this.make(ToastWrapper.SUCCESS_CLASS, msg, length);
  }

  /**
   * Displays a toast message
   * with "warn" styles and
   * default medium length.
   * @param msg
   * @param length
   */
  public warn(msg:string,length?:number):void{
    this.make(ToastWrapper.WARN_CLASS,msg, length);
  }

  /**
   * Creates a toast message
   * according to class styles
   * and predefined time length.
   * @param cssClass
   * @param msg
   * @param length
   */
  private make(cssClass:string, msg: string, length?: number):void {
    this.create({
      message: msg,
      duration: length || ToastWrapper.LENGTH_MEDIUM,
      cssClass: cssClass
    }).present();
  }
}
