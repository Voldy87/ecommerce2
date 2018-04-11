import { NgModule } from '@angular/core';
import { ProductCardComponent, ModalContentPage } from './product-card/product-card';
import { ReviewsModalComponent } from './reviews-modal/reviews-modal';
import { ProductFilterComponent } from './product-filter/product-filter';
import { I18nMenuComponent } from './i18n-menu/i18n-menu';
import { ModalNativeLangsComponent } from './modal-native-langs/modal-native-langs';
@NgModule({
	declarations: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent,
    I18nMenuComponent,
    ModalNativeLangsComponent],
	imports: [],
	exports: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent,
    I18nMenuComponent,
    ModalNativeLangsComponent]
})
export class ComponentsModule {}
