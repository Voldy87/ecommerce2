import { Component } from '@angular/core';
import { NavController,ActionSheetController, Platform } from 'ionic-angular';


import { ContactPage } from '../contact/contact';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor( public platform: Platform, public alertCtrl: ActionSheetController, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController) {

  }

  YourFancyButton(){
    this.navCtrl.setRoot(ContactPage);
  }

  presentActionSheet() {
    let actionSheet = this.alertCtrl.create({
      title: 'How do you find our app?',
      buttons: [
        {
          text: 'Share your opinion',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite the app',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
}


}
