import {Component, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {FirebaseAuthService} from "../../services/firebase-auth-service";
import {LoadingController, MenuController, NavController} from "ionic-angular";
import {BackupPage} from "../backup/backup";


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
    private _menuCtrl:MenuController,
    private _navCtrl:NavController
  ){}


  /**
   * Perform authentication over Firebase
   * service by email and password.
   * @param form: NgForm in UI
   * @param selectedBehaviour: signin|signup
   * @private
   */
  _authenticate(form:NgForm, selectedBehaviour:string){

    //authentication method options,
    // login or register and login
    let authBehaviours = {
      signup:this._authSrv.signup,
      signin:this._authSrv.signin
    };

    //displays a loading message to the user
    let loadingWin = this._loadingCtrl.create({
      content:'In progress, please wait...'
    });

    loadingWin.present();

    //starts the auth...
    authBehaviours[selectedBehaviour](form.value.email,form.value.password)
      //user registered and/or logged-in
      .then(data=>{
        loadingWin.dismiss();
        this._menuCtrl.close();
        //TODO:check why using navCtr.push() breaks the BackupPage status
        //this._navCtrl.push(BackupPage);
      })
      .catch(error=>{
        console.error(error);
        loadingWin.dismiss();
        this._message = error.message;
      });
  }

}
