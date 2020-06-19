import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { slideAnimation } from './photo-slider.animation';
import { IProductImage } from 'src/app/shared/interfaces/product.inteface';

@Component({
  selector: 'ngx-shop-product-photo',
  templateUrl: './photo-slider.component.html',
  animations: slideAnimation,
})
export class PhotoSliderComponent {
  @Input()
  public images!: IProductImage[];
  public currentIndex = 0;

  public animateRight = {
    translateEnter: 'translateX(100%)',
    translateLeave: 'translateX(-100%)',
  };
  public animateLeft = {
    translateEnter: 'translateX(-100%)',
    translateLeave: 'translateX(100%)',
  };
  public isSlidedRight = true;
  public slidingBlocked = false;

  constructor(private readonly _cdr: ChangeDetectorRef) {}

  public next(): void {
    if (this.slidingBlocked) {
      return;
    }
    this.isSlidedRight = true;
    this._cdr.detectChanges();
    if (this.currentIndex === this.images.length - 1) {
      this.currentIndex = 0;
      return;
    }
    this.currentIndex += 1;
  }

  public prev(): void {
    if (this.slidingBlocked) {
      return;
    }
    this.isSlidedRight = false;
    this._cdr.detectChanges();
    if (this.currentIndex === 0 && this.images) {
      this.currentIndex = this.images.length - 1;
      return;
    }
    this.currentIndex -= 1;
  }

  public show(i: number): void {
    if (this.slidingBlocked) {
      return;
    }
    this.isSlidedRight = this.currentIndex < i;
    this._cdr.detectChanges();
    this.currentIndex = i;
  }

  public animationStart(): void {
    this.slidingBlocked = true;
  }

  public animationEnd(): void {
    this.slidingBlocked = false;
  }
}
