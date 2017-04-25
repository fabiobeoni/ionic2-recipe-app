import {Component, NgZone} from '@angular/core';
import {FirebaseStorageService} from "../../services/firebase-storage-service";
import {FirebaseAuthService} from "../../services/firebase-auth-service";
import {RecipeService} from "../../services/recipe-service";
import {Recipe} from "../../models/recipe";
import {JsonCast} from "../../utils/json-cast";
import {ToastWrapper} from "../../utils/toast-wrp";

@Component({
  selector: 'page-backup',
  templateUrl: 'backup.html'
})
export class BackupPage {

  private readonly BACKUP_URL:string = '/{0}/backup.txt';
  private _status:string;
  private _progress:number = -1;
  private _message:string;
  private _canBackup:boolean = false;

  constructor(
    private _firebaseAuthSrv:FirebaseAuthService,
    private _firebaseStorageSrv:FirebaseStorageService,
    private _recipeSrv:RecipeService,
    private _ngZone:NgZone,
    private _toastWrp:ToastWrapper)
  {}

  ionViewDidLoad(){
    let self = this;
    this._firebaseAuthSrv.onAuthStateChance=()=>{
      self.authChangeHandler();
    };

    this.authChangeHandler();
  }

  private authChangeHandler(){
    this._canBackup = this._firebaseAuthSrv.isUserAuthenticated;
    if(!this._canBackup)
      this._message = 'Looks like you have lost your login session. Please sign-in again to perform a backup/restore.'
  }

  private performBackup():void{
    let self = this;
    this._recipeSrv.getRecipes((recipes:Recipe[],err:Error)=>{
      if(!err){
        if(recipes.length>0)
        {
          self._message = 'Backup started, please wait...';

          let fileContent:string = JSON.stringify(recipes);
          let uploadUrl:string = self.getBackupURL();

          self._firebaseStorageSrv.uploadFile(
            uploadUrl,
            fileContent,
            (progress:number,state:string,shapshotUrl:string,error:firebase.FirebaseError)=>{
              self._progress = progress;
              self._status = state;

              if(error) self._message = error.message;
              if(self._progress==100) self._message = 'Completed. '+ shapshotUrl;
            }
          );
        }
        else self._toastWrp.warn('You don\'t have any recipe yet to backup.');
      }
      else
        self._message = err.message;
    });
  }

  private performRestore():void{
    let self = this;
    this._message = 'Restore started, please wait...';

    this._firebaseStorageSrv.downloadFile(
      this.getBackupURL(),
      (json:any,downloadErr:Error)=>{
        //ngZone.run() is needed to make angular update
        //the view since the _message field is updated
        //in a callback that stops observables.
        //This works automatically instead in .performBackup()
        //because the callback is invoked by a firebase event
        self._ngZone.run(()=>{
          if(!downloadErr)
          {
            let recipes:Recipe[] = JsonCast.castMany<Recipe>(json,Recipe);
            if(recipes.length>0)
              self._recipeSrv.addRecipes(recipes,(storingErr:Error)=>{
                if(!storingErr) self._message = 'Restoring completed.';
                else self._message = storingErr.message;
              });
            //this case should never happen since backup can be created
            //only when recipes are available, but the admin of Firebase
            //could clean up the file remotely
            else {
              self._message = '';
              self._toastWrp.warn('Your backup it\'s empty!');
            }
          }
          else self._message = downloadErr.message;
        });
    });
  }

  private getBackupURL():string {
    let user: firebase.User = this._firebaseAuthSrv.user;
    return this.BACKUP_URL.format(user.uid);
  }
}
