import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { FeedbacksComponent } from './description/feedbacks/feedbacks.component';
import { PhotoSliderComponent } from './photo-slider/photo-slider.component';
import { DescriptionComponent } from './description/description.component';
import { InformationComponent } from './information/information.component';
import { RatingComponent } from './description/feedbacks/rating/rating.component';


@NgModule({
  declarations: [
    ProductComponent,
    DescriptionComponent,
    InformationComponent,
    PhotoSliderComponent,
    FeedbacksComponent,
    RatingComponent,
  ],
  imports: [SharedModule, ProductRoutingModule],

})
export class ProductModule {
}