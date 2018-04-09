import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//import { ProductCardComponent } from '../../components/product-card/product-card';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  products:object
  public toggle:boolean
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.toggle = false;
    this.products = [
      {
        "title":"logo",
        "description":"desc",
        "slogan":"slog",
        "img_url": "logo.png",
        "category":"tech",
        "price": 4444,
        "reviews":[{
          "stars":5,
          "name":"gianni",
          "comment":"bien que lorem ppsium que lorem ppsium que lorem ppsium que lorem ppsium que lorem ppsiumque lorem ppsium que lorem ppsium",
          "date":1.111122223333e+12
          },
          {
          "stars":2,
          "name":"renat",
          "comment":"uaw",
          "date":1.111102223133e+12
          },
          {
          "stars":1,
          "name":"assano",
          "comment":"good",
          "date":1.111102023333e+12
          }
        ]
      },
      {
        "title":"logo3",
        "description":"desc3",
        "slogan":"a very nice product IMHO",
        "img_url": "logo.png",
        "category":"tech",
        "price": 7777,
        "reviews":[{
          "stars":3,
          "name":"gianni",
          "comment":"bien",
          "date":1.111122223333e+12
          },
          {
          "stars":0,
          "name":"renat",
          "comment":"uaw",
          "date":1.111102223133e+12
          },
          {
          "stars":1,
          "name":"assano",
          "comment":"good",
          "date":1.111102023333e+12
        }
        ]
      },
      {
        "title":"logow23",
        "description":"aassssss",
        "slogan":"wwwwwww",
        "img_url": "logo.png",
        "category":"tech",
        "price": 2222,
        "reviews":[{
          "stars":3,
          "name":"gianni",
          "comment":"bien",
          "date":1.111122223333e+12
          },
          {
          "stars":5,
          "name":"renat",
          "comment":"uaw",
          "date":1.111102223133e+12
          },
          {
          "stars":1,
          "name":"assano",
          "comment":"good",
          "date":1.111102023333e+12
        }
        ]
      }
    ]
  }

  delSpinner()  {
    console.log("delete spinner now");
  }

  search(event:Event)  {
    console.log("search");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  public notify() {
    console.log("Toggled: "+ this.toggle);
  }

}