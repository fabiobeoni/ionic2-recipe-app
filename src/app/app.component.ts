import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import {AuthPage} from "../pages/auth/auth";
import {FirebaseAuthService} from "../services/firebase-auth-service";
import {BackupPage} from "../pages/backup/backup";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  get backupPage() {
    return this._backupPage;
  }
  get tabsPage() {
    return this._tabsPage;
  }

  get authPage() {
    return this._authPage;
  }

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  private _tabsPage = TabsPage;
  private _authPage = AuthPage;
  private _backupPage = BackupPage;
  private _isUserAuthenticated:boolean;

  @ViewChild('nav') nav:NavController;

  constructor(
    platform: Platform,
    private menuCtrl:MenuController,
    private _firebaseAuthSrv:FirebaseAuthService) {

    let appComp = this;

    //not really needed here unless you want
    //to use the auth to change app behaviours,
    //in case the menu items
    _firebaseAuthSrv.onAuthStateChance=()=>{
      appComp._isUserAuthenticated = _firebaseAuthSrv.isUserAuthenticated;
    };

    _firebaseAuthSrv.initialize();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  displayPage(page:Component){
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  logout():void{
    this._firebaseAuthSrv.logout();
    this.displayPage(this._tabsPage);
  }
}
