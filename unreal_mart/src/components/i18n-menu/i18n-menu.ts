import { Component,  OnInit  } from '@angular/core';
import { ActionSheetController, Platform } from 'ionic-angular';


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

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
  constructor(private countryService: CountryService, public platform: Platform, public sheetCtrl: ActionSheetController) {
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
    var arr = Array()
    let k;
    for (k in this.countries ){
        //console.log(this.countries[k]["languages"])
        arr.push({
              "text": this.countries[k]["name"],
              "cssClass":"countryOption"
              //"handler": this.showLangOptions(this.countries[k]["languages"])
            })
      }
    this.presentActionSheet(arr)

  }

  presentActionSheet(arr) {
    let actionSheet = this.sheetCtrl.create({
      title: 'Select your country',
      subTitle: 'Then you will be prompted to choose the desired language',
      buttons: arr,
    });
    actionSheet.present().then(() => {
      this.addFlags();
    }).catch(error => {
      console.log("error while opening actionsheet page", error);
    });

  }

  addFlags(){
    var x = document.querySelectorAll(".countryOption .button-effect");
    console.log(x)
    for (let i = 0; i < x.length; i++) {
      var parent = x[i].parentNode;
      var myImage = new Image(60, 30);
      myImage.src = this.countries[i]["flag"];
      myImage.style.marginTop = "5px";
      parent.insertBefore(myImage,x[i])
    }
  }
  showLangOptions(){

  }



}
