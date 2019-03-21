import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { HomePage } from '../pages/home/home'; //import page to be set as initial root
import { SplashPage } from '../pages/splash/splash';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage; //initial root setting

  constructor(platform: Platform, statusBar: StatusBar, modalCtrl: ModalController, splashScreen: SplashScreen, public fcm: FCM) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      if (platform.is('android')||platform.is('ios')||platform.is('windows')) {
        console.log("mobile")
        let Splash = modalCtrl.create(SplashPage);
        Splash.present();
        this.fcm.getToken().then(token => {

          // Your best bet is to here store the token on the user's profile on the
          // Firebase database, so that when you want to send notifications to this
          // specific user you can do it from Cloud Functions.
        });
      }
      else {
        console.log("desktop")
        splashScreen.hide();
      }

    });
  }
}

