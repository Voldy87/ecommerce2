/*----------------- base components -------------------*/
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
/*----------------- i18n -------------------*/
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
/*----------------- ROOT -------------------*/
import { MyApp } from './app.component';
/*----------------- custom components -------------------*/
import { ProductCardComponent, ModalContentPage } from '../components/product-card/product-card';
import { ReviewsModalComponent } from '../components/reviews-modal/reviews-modal';
import { ModalNativeLangsComponent } from '../components/modal-native-langs/modal-native-langs';
import { I18nMenuComponent } from '../components/i18n-menu/i18n-menu';
/*----------------- pages -------------------*/
import { HomePage } from '../pages/home/home';
//custom pages
import { ContactPage } from '../pages/contact/contact';
import { MainPage } from '../pages/main/main';
import { ProductFilterComponent, FiltersPipe } from '../components/product-filter/product-filter';
import { FooterComponent } from '../components/footer/footer';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactPage,
    MainPage,
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ModalNativeLangsComponent,
    ProductFilterComponent,
    FiltersPipe,
    I18nMenuComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactPage,
    MainPage,
    ModalContentPage,
    ModalNativeLangsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
