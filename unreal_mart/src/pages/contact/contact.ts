import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  doPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Newsletter Subscription',
      message: 'Enter your email address',
      inputs: [
        {
          name: 'mail_address',
          placeholder: 'Your email here..'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: () => {
            console.log('Saved clicked');
          }
        }
      ]
    });

    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

}
