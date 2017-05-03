import {Component, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {FirebaseAuthService} from "../../services/firebase-auth-service";
import {LoadingController, MenuController, NavController} from "ionic-angular";
import {BackupPage} from "../backup/backup";
import {ToastWrapper} from "../../utils/toast-wrp";
import {TabsPage} from "../tabs/tabs";


/*
  This page shows a different approach to
  validating input data. Uses angular only,
  instead of model validation we have for
  recipe. The code behind works directly
  with the form submitted instead of
  the model class.
*/
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage {

  /**
   * Message displayed on UI about authentication steps and status.
   */
  private _message:string;

  constructor(
    private _authSrv:FirebaseAuthService,
    private _loadingCtrl:LoadingController,
    private _navCtrl:NavController,
    private _toastWrp:ToastWrapper
  ){}


  /**
   * Perform authentication over Firebase
   * service by email and password.
   * @param form: NgForm in UI
   * @param selectedBehaviour: signin|signup
   * @private
   */
  _authenticate(form:NgForm, selectedBehaviour:string){

    //displays a loading message to the user
    let loadingWin = this._loadingCtrl.create({
      content:'In progress, please wait...'
    });

    loadingWin.present();

    //starts the auth...
    this._authSrv[selectedBehaviour](form.value.email,form.value.password)
      //user registered and/or logged-in
      .then(data=>{
        loadingWin.dismiss();
        this._message = 'You are logged-in.';
        //TODO:check why using navCtr.push() breaks the BackupPage status
        this._navCtrl.push(BackupPage);
      })
      .catch(error=>{
        loadingWin.dismiss();
        this._toastWrp.warn(error.message);
      });
  }

}
