import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import  firebase from 'firebase';

import { Items } from "../pages/items/items";
import { Login } from "../pages/login/login";

//Written by Brandon Alleyne - on my way up
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Login;
  isAuthenticated = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    
   firebase.initializeApp({
     apiKey: "API_KEY",
     authDomain: "slinventory-fbd18.firebaseapp.com"
   });
   firebase.auth().onAuthStateChanged(user=>{
     if(user) 
     {
      this.isAuthenticated = true;
      this.rootPage = Items;
     }
     else{
       this.isAuthenticated = false;
       this.rootPage = Login;
     }
   })
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      setTimeout(()=>{
        splashScreen.hide();
      }, 100);
      
    });
  }
}

