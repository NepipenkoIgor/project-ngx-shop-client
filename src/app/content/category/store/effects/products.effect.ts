import { IStore } from 'src/app/store/reducers';
import {
  getProductsSuccess,
  getProductsPending,
} from './../actions/products.actions';

import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { createEffect, ofType, Actions } from '@ngrx/effects';

import {
  switchMap,
  map,
} from 'rxjs/operators';
import { ProductsService } from 'src/app/shared/services/products.service';
import { getSuggestedProductsPending, getSuggestedProductsSuccess } from 'src/app/store/actions/products.actions';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions: Actions,
    private productsService: ProductsService,
  ) {}
// tslint:disable-next-line: no-any
  public getProducts$: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(getProductsPending),
      switchMap(({ type, ...search }) => {
        return this.productsService.getProductsBySubCategory(search).pipe(
          // tslint:disable-next-line: no-any
          map((_products: any) => {
            const products = _products.items;
            return getProductsSuccess({ products });
          }),
        );
      }),
    ),
  );
  public getSuggestedProducts$: Observable<any> = createEffect(() =>
      this.actions.pipe(
        ofType(getSuggestedProductsPending),
        switchMap(() => {
          return this.productsService.getSuggestedProducts().pipe(
            // tslint:disable-next-line: no-any
            map((_products: any) => {
              const products = _products.items;
              return getSuggestedProductsSuccess( {products} );
            }),
          );
        }),
      ),
    );
  };
