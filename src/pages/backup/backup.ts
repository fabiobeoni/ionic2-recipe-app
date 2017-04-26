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

  /**
   * The path of the Firebase resource storing the
   * remote backup of local recipes data.
   * The variable part is about the user ID.
   * @type {string}
   */
  private readonly BACKUP_URL:string = '/{0}/backup.txt';

  /**
   * Holds the status of the backup/restore
   * task in progress. Displayed on UI.
   */
  private _status:string;

  /**
   * Holds the the progress percentage of the
   * backup/restore task. Displayed on UI.
   * @type {number}
   * @private
   */
  private _progress:number = -1;

  /**
   * Message displayed on UI as info
   * to the user.
   */
  private _message:string;

  /**
   * Tells the UI when controls about
   * backup/restore can be enabled.
   * @type {boolean}
   * @private
   */
  private _canBackup:boolean = false;

  constructor(
    private _firebaseAuthSrv:FirebaseAuthService,
    private _firebaseStorageSrv:FirebaseStorageService,
    private _recipeSrv:RecipeService,
    private _ngZone:NgZone,
    private _toastWrp:ToastWrapper)
  {}

  //Registers the Firebase auth state change handler.
  ionViewDidLoad(){
    let self = this;
    this._firebaseAuthSrv.onAuthStateChance=()=>{
      self._authChangeHandler();
    };

    this._authChangeHandler();
  }

  /**
   * Keep tracks on component
   * the status of the user auth on Firebase,
   * and displays a message to the user when
   * session is lost.
   */
  private _authChangeHandler(){
    this._canBackup = this._firebaseAuthSrv.isUserAuthenticated;
    if(!this._canBackup)
      this._message = 'Looks like you have lost your login session. Please sign-in again to perform a backup/restore.'
  }

  /**
   * Loads the recipes list from
   * the local database and backup
   * them as a single text resource
   * on Firebase Storage service.
   * @private
   */
  private _performBackup():void{
    let self = this;

    //loads the list of recipes to backup from the
    //local database
    this._recipeSrv.getRecipes((recipes:Recipe[],err:Error)=>{
      if(!err){
        if(recipes.length>0)
        {
          self._message = 'Backup started, please wait...';

          //serialises the data to JSON to store
          //all of them at once as a single Firebase
          //storage object
          let fileContent:string = JSON.stringify(recipes);

          //gets teh Firebase reference URL of the backup
          //for the current logged user
          let uploadUrl:string = self._getBackupURL();

          //performs the bakup sending the file
          //to Firebase Storage
          self._firebaseStorageSrv.uploadFile(
            uploadUrl,
            fileContent,
            //this is the task process change callback,
            //printing to the UI the task status
            (progress:number,state:string,shapshotUrl:string,error:firebase.FirebaseError)=>{
              self._progress = progress;
              self._status = state;
              if(error) self._message = error.message;

              //when task is completed...
              if(self._progress==100) self._message = 'Backup completed.';
            }
          );
        }
        else self._toastWrp.warn('You don\'t have any recipe yet to backup.');
      }
      else
        self._message = err.message;
    });
  }

  /**
   * Downloads the recipes list
   * as a single text resource
   * from Firebase Storage service,
   * then saves it locally on database
   * overriding local data (if any).
   * @private
   */
  private _performRestore():void{
    let self = this;
    this._message = 'Restore started, please wait...';

    //starts downloading the file from Firebase
    this._firebaseStorageSrv.downloadFile(
      this._getBackupURL(),
      //this is the download task status change handler
      (json:any,downloadErr:Error)=>{
        //ngZone.run() is needed to make angular update
        //the view since the _message field is updated
        //in a callback that stops observables.
        //This works automatically instead in ._performBackup()
        //because the callback is invoked by a firebase event
        self._ngZone.run(()=>{
          if(!downloadErr)
          {
            //here I made this util to cast the generic
            //JSON object to typed classes required by Typescript.
            //It's needed to make the typescript class-validation
            //library to work properly. Unfortunately this util
            //does not cast nested objects, but for the scope of
            //this sample app is enough.
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

  /**
   * Returns a user based URL from Firebase
   * where the backup is stored.
   * @returns {string}
   * @private
   */
  private _getBackupURL():string {
    let user: firebase.User = this._firebaseAuthSrv.user;
    return this.BACKUP_URL.format(user.uid);
  }
}
