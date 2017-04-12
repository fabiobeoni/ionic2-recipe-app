import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import firebase from 'firebase';

import { TabsPage } from '../pages/tabs/tabs';
import {SigninPage} from "../pages/signin/signin";
import {SignupPage} from "../pages/signup/signup";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  tabsPage = TabsPage;
  signInPage = SigninPage;
  signUpPage = SignupPage;

  //
  @ViewChild('nav') nav:NavController;

  constructor(platform: Platform, private menuCtrl:MenuController) {

    //not really needed here unless you want
    //to use the auth to change app behaviours
    firebase.initializeApp({
      apiKey: "AIzaSyCFN3pjOjpCOn3kYzeQzUHZXarD5g2uOW4",
      authDomain: "ionic2-recipe-app-fcb9c.firebaseapp.com",
      databaseURL: "https://ionic2-recipe-app-fcb9c.firebaseio.com",
      projectId: "ionic2-recipe-app-fcb9c",
      storageBucket: "ionic2-recipe-app-fcb9c.appspot.com",
      messagingSenderId: "178926283871"
    });

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

  logout():void{}
}
