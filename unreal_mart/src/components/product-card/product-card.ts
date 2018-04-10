import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
//import { TitleCasePipe } from '@angular/common';
//import { ReviewsModalComponent } from '../reviews-modal/reviews-modal';

/**
 * Generated class for the ProductCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product-card',
  templateUrl: 'product-card.html'
})
export class ProductCardComponent {
  @Input('item-input') item;
  @Output() loadedItems = new EventEmitter();
  FullStars = Array;
  full:number = 0;
  EmptyStars = Array;
  empty:number = 5;
  constructor(public modalCtrl: ModalController) {}
  ngAfterViewInit(){
    this.loadedItems.emit()
    this.elaborateStars(this.item.reviews)
  }
  iconAssign(category){ //in reality get category-icon associations from BE
    switch(category) {
      case "tech": {
         return "aperture"
      }
      case "constant_expr2": {
         break;
      }
      default: {
         //statements;
         break;
      }
   }
  }
  openModal() {
    let modal = this.modalCtrl.create(ModalContentPage, {"reviews":this.item.reviews});
    modal.present();
  }
  elaborateStars(reviews){
    var count=0
    for (let i of reviews)
      count+=i.stars
    count/=reviews.length
    this.full=Math.floor(count);
    this.empty=5-this.full;
  }
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Reviews on the product
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <reviews-modal *ngFor="let rev of reviews" [rev-input]="rev"></reviews-modal>
    </ion-list>
  </ion-content>
  `
})
export class ModalContentPage {
  reviews;
  constructor(public platform: Platform,public params: NavParams,public viewCtrl: ViewController) {
    this.reviews = this.params.get('reviews');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
