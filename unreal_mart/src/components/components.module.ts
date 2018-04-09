import { NgModule } from '@angular/core';
import { ProductCardComponent, ModalContentPage } from './product-card/product-card';
import { ReviewsModalComponent } from './reviews-modal/reviews-modal';
import { ProductFilterComponent } from './product-filter/product-filter';
@NgModule({
	declarations: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent],
	imports: [],
	exports: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent,
    ProductFilterComponent]
})
export class ComponentsModule {}
