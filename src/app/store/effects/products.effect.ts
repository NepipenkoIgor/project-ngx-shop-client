import { IStore } from 'src/app/store/reducers';
import {
  getProductsSuccess,
  getProductSuccess,
  getProductPending,
  getProductsPending,
  createFeedbackPending,
  createFeedbackSuccess,
} from './../actions/products.actions';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createEffect, ofType, Actions } from '@ngrx/effects';

import {
  switchMap,
  map,
  withLatestFrom,
  mergeMap,
} from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { ProductsService } from 'src/app/shared/services/products.service';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions: Actions,
    private productsService: ProductsService,
    private store: Store<IStore>,
  ) {}

  public getProduct$: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(getProductPending),
      switchMap(({ id }) =>
        this.productsService
          .getProductById(id)
          .pipe(
            map((product: any) => {
                return getProductSuccess({ product });
            })
        ),
      ),
    ),
  );
  public addFeedback$: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(createFeedbackPending),
      withLatestFrom(this.store.select('products', 'item', '_id')),
      switchMap(([{ feedback }, product]) =>
        this.productsService
          .createFeedback({...feedback, product })
          .pipe(
            mergeMap(() => [
              createFeedbackSuccess(),
              getProductPending({ id: product }),
            ]),
            ),
          ),
      ),
  );



  public getProducts$: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(getProductsPending),
      switchMap(({ type, ...search }) => {
       return this.productsService.getProductsBySubCategory(search).pipe(
          map((products: any) => {
                  return  getProductsSuccess({products});
          })
        );
      })
    )
  );
}
