import { Component  } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
/**
 * Generated class for the ModalNativeLangsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-native-langs',
  templateUrl: 'modal-native-langs.html'
})
export class ModalNativeLangsComponent {
  nativeLangs:Array<string>
  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.nativeLangs = params.get('nativeLangs')
  }
  choseAndDismiss(event: any) {
    let data = event.target.innerHTML;
    console.log(data)
    this.viewCtrl.dismiss(data);
  }

}
