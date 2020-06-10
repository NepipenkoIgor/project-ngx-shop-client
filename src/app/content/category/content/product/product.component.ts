import { Component, OnInit, ComponentFactoryResolver, Injector, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Store } from '@ngrx/store';
import { IStore } from 'src/app/store/reducers';
import {
  getProductPending, createFeedbackPending,
} from 'src/app/store/actions/products.actions';
import { Observable } from 'rxjs/internal/Observable';
import { IFeedback } from 'src/app/store/reducers/products.reducer';
import { ModalService } from 'src/app/modal/modal.service';

@Component({
  selector: 'ngx-shop-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    public productsService: ProductsService,
    private store: Store<IStore>,
    private  _modalService: ModalService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector
  ) {}
  @Output()
  public addReview: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line: no-any
  public query: any;
  // tslint:disable-next-line: no-any
  public product$?: Observable<any> = this.store.select('products', 'item');
  // tslint:disable-next-line: no-any
  public product: any;

  public ngOnInit(): void {
    this.query = this.activatedRoute.snapshot.queryParams;
    const { id } = this.query;

    this.store.dispatch(getProductPending({ id }));
    this.product$?.subscribe((product) => (this.product = product));
  }
  public async addFeedback(): Promise<void> {
    const component = await import(
      './description/feedbacks/feedbacks.component'
    );

    this._modalService.open({
      component: component.FeedbacksComponent,
      resolver: this._componentFactoryResolver,
      injector: this._injector,
      context: {
        save: (value: IFeedback) => {
          this.store.dispatch(
            createFeedbackPending({
              feedback: { ...value },
            }),
          );
          this._modalService.close();
        },
        close: () => {
          this._modalService.close();
        },
      },
    });
  }
}
