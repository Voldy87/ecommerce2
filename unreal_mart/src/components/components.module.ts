import { NgModule } from '@angular/core';
import { ProductCardComponent, ModalContentPage } from './product-card/product-card';
import { ReviewsModalComponent } from './reviews-modal/reviews-modal';
@NgModule({
	declarations: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent],
	imports: [],
	exports: [
    ProductCardComponent,
    ModalContentPage,
    ReviewsModalComponent]
})
export class ComponentsModule {}
