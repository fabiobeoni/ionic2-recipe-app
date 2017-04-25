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

  private _message:string;

  constructor(
    private _authSrv:FirebaseAuthService,
    private _loadingCtrl:LoadingController,
    private _menuCtrl:MenuController,
    private _navCtrl:NavController
  ){}


  authenticate(form:NgForm,selectedBehaviour:string){

    let authBehaviours = {
      signup:this._authSrv.signup,
      signin:this._authSrv.signin
    };

    let loadingWin = this._loadingCtrl.create({
      content:'In progress, please wait...'
    });

    loadingWin.present();

    authBehaviours[selectedBehaviour](form.value.email,form.value.password)
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
