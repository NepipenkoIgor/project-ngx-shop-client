import { Component, Input, NgModule } from '@angular/core';
import { IProduct } from '../../../../../store/reducers/products.reducer';

@Component({
  selector: 'ngx-shop-product-description',
  templateUrl: './description.component.html',
})
export class DescriptionComponent {
  @Input() public product!: IProduct;
  public isShowDescription = true;

  public toggleTab() {
    this.isShowDescription = !this.isShowDescription;
  }

  public close!: () => void;
  public save!: (value: object) => void;
}
