import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {FirebaseAuthService} from "../services/firebase-auth-service";
import { TabsPage } from '../pages/tabs/tabs';
import {AuthPage} from "../pages/auth/auth";
import {BackupPage} from "../pages/backup/backup";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  //app pages to be displayed on app menu,
  //menu navigation is manager in this class.
  private _tabsPage = TabsPage;
  private _authPage = AuthPage;
  private _backupPage = BackupPage;

  /**
   * Keep tracks of user authentication
   * status and it's updated on status
   * changes.
   */
  private _isUserAuthenticated:boolean;

  /**
   * Reference to the navigation on UI
   */
  @ViewChild('nav') _nav:NavController;

  constructor(
    private _platform: Platform,
    private _menuCtrl:MenuController,
    private _firebaseAuthSrv:FirebaseAuthService)
  {

    let self = this;

    //not really needed here unless you want
    //to use the auth to change app behaviours,
    //in case the menu items
    _firebaseAuthSrv.onAuthStateChance=()=>{
      self._isUserAuthenticated = _firebaseAuthSrv.isUserAuthenticated;
    };

    _firebaseAuthSrv.initialize();

    _platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  /**
   * Loads the provided page component
   * as root page, then closes the app menu.
   * @param page
   * @private
   */
  private _displayPage(page:Component){
    this._nav.setRoot(page);
    this._menuCtrl.close();
  }

  /**
   * Performs logout over Firebase service
   * then closes the menu and brings the user
   * th the main app page.
   * @private
   */
  private _logout():void{
    this._firebaseAuthSrv.logout();
    this._displayPage(this._tabsPage);
  }
}
