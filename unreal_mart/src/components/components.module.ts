import { NgModule } from '@angular/core';
import { ProductCardComponent, ModalContentPage } from './product-card/product-card';
import { ReviewsModalComponent } from './reviews-modal/reviews-modal';
import { ProductFilterComponent } from './product-filter/product-filter';
import { I18nMenuComponent } from './i18n-menu/i18n-menu';
@NgModule({
	declarations: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent,
    I18nMenuComponent],
	imports: [],
	exports: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent,
    I18nMenuComponent]
})
export class ComponentsModule {}
