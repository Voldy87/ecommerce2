import { Component } from '@angular/core';

/**
 * Generated class for the FooterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {

  currentYear: string;

  constructor() {
    var year = new Date();
    this.currentYear = year.getFullYear().toString();
  }

}
