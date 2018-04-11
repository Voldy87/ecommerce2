import { Component,  OnInit  } from '@angular/core';
import { ActionSheetController, Platform, NavController, ModalController } from 'ionic-angular';


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

import { ModalNativeLangsComponent } from '../modal-native-langs/modal-native-langs';

export interface Country {
  data: string;
  flag:string;
  languages:Array<Object>;
}

@Injectable()
export class CountryService {
  all: string
  constructor(private http: HttpClient) {
    this.all = "https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;languages;flag"
  }
  getAll():Observable<Country[]>{
    return this.http.get<Country[]>(this.all)
  }
}

@Component({
  selector: 'i18n-menu',
  templateUrl: 'i18n-menu.html',
  providers: [CountryService],
  styles: ['.error {color: red;}']
})
export class I18nMenuComponent implements OnInit {
  countries: Country[];
  flag: string;
  lang: string;
  actionSheet
  nativeLangs=''
  constructor(private countryService: CountryService, public platform: Platform, public sheetCtrl: ActionSheetController, public nav: NavController, public modalCtrl: ModalController) {
    this.lang = "English"
    this.flag = "https://restcountries.eu/data/usa.svg"
  }
  ngOnInit() {
    this.getCountries();
  }
  getCountries(): void {
    this.countryService.getAll()
    .subscribe(countries => this.countries = countries);
  }

  setLang() : void {
    /* var arr = Array()
    let k;
    for (k in this.countries ){
        //console.log(this.countries[k]["languages"])
        arr.push({
              "text": this.countries[k]["name"],
              "cssClass":"countryOption",
              "handler": (k) => {
                console.log(k)
              }
            })
      } */
    this.presentActionSheet()

  }

  presentActionSheet() {
    this.actionSheet = this.sheetCtrl.create({
      title: 'Select your country',
      subTitle: 'Then you will be prompted to choose the desired language',
      cssClass: "countryOption_sheet",
      enableBackdropDismiss: false
      //buttons: arr,
    });
    for (let k in this.countries ){
          var button = {
            "text": this.countries[k]["name"],
            "cssClass":"countryOption_button",
            "handler": () => {
              this.flag = this.countries[k]["flag"]
              var natives = this.countries[k]["languages"]
              if (natives.length>1){
                 natives = natives.map(lang => lang["nativeName"])
                 /*console.log(this.nativeLangs)
                this.nativeLangs = natives*/
                var myModal = this.modalCtrl.create(ModalNativeLangsComponent, { 'nativeLangs': natives });
                myModal.present();
                //this.showLangOptions(natives,this.countries[k]["name"])
              }
              else
                this.lang = natives[0]["nativeName"]
            }
          }
          this.actionSheet.addButton(button)
        }
    this.actionSheet.present().then(() => {
      this.add_FlagsLangs();
    }).catch(error => {
      console.log("error while opening actionsheet page", error);
    });

  }

  add_FlagsLangs(){
    var x = document.querySelectorAll(".countryOption_button .button-effect");
    console.log(x)
    for (let i = 0; i < x.length; i++) {
      x[i].id = this.countries[i]["name"]
      var parent = x[i].parentNode;
      var myImage = new Image(60, 30);
      myImage.src = this.countries[i]["flag"];
      myImage.style.marginTop = "5px";
      parent.insertBefore(myImage,x[i])
      var div = document.createElement("div");
      div.id = this.countries[i]["name"]
      div.classList.add("nativeLangs")
      var span;
      var langs = this.countries[i]["languages"]
      for (let j = 0; j < langs.length; j++) {
        span = document.createElement("span");
        span.addEventListener( "click", () => this.lang = langs[j]["nativeName"] );
        span.appendChild(document.createTextNode(langs[j]["nativeName"]));
        div.appendChild(span)
      }
      parent.insertBefore(div,x[i])
      //div.style.display="None"
    }
  }


}
