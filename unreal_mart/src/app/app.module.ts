import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
//custom components
import { ProductCardComponent, ModalContentPage } from '../components/product-card/product-card';
import { ReviewsModalComponent } from '../components/reviews-modal/reviews-modal';

import { HomePage } from '../pages/home/home';
//custom pages
import { ContactPage } from '../pages/contact/contact';
import { MainPage } from '../pages/main/main';
import { ProductFilterComponent } from '../components/product-filter/product-filter';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactPage,
    MainPage,
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactPage,
    MainPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
