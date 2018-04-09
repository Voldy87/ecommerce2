import { Component } from '@angular/core';

/**
 * Generated class for the ProductFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product-filter',
  templateUrl: 'product-filter.html'
})
export class ProductFilterComponent {

  toggle: boolean;

  rating: number = 2;
  categoryData: any;
  category: any;
  shipping:string;
  productorAlertOpts: any;
  productorData: any;
  productors: Array<string>;
  dualPrice: any = { lower: 0, upper: 10000 };

  constructor() {
    this.categoryData = [
      { text: 'Tech', value: 'tech' },
      { text: 'Animals', value: 'animals' },
      { text: 'Emotions', value: 'emotions' }
    ];
    this.shipping="earth"
    this.productorAlertOpts = {
      title: 'Want to buy only from certain sources?',
      subTitle: 'Select your favorite productors'
    };
    this.productorData = [
      { text: 'Zeus', value: 'zeus' },
      { text: 'God', value: 'god' },
      { text: 'Azazel', value: 'azazel' },
      { text: 'Lucifer', value: 'lucifer' },
      { text: 'Athena', value: 'athena' },
      { text: 'ACME', value: 'acme' },
      { text: 'Scorpio', value: 'scorpio' },
    ];
  }
  compareFn(option1: any, option2: any) {
    return option1.value === option2.value;
  }

  filterItems(event:Event){}
}
