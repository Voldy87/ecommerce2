import { Component, Input } from '@angular/core';
//import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
/**
 * Generated class for the ReviewsModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'reviews-modal',
  templateUrl: 'reviews-modal.html'
})
export class ReviewsModalComponent {
  reviewTime: string;
  @Input('rev-input') review;
  constructor() { }
  ngAfterViewInit(){
    let date = new Date(this.review.date);
    this.reviewTime=date.toISOString();
  }
}
