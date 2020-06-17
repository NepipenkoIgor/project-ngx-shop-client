import { UnSubscriber } from './../../shared/utils/unsubscriber';
import { IProduct } from 'src/app/content/category/content/product/store/reducers/product.reducer';
import { getCategoriesPending } from 'src/app/store/actions/category.actions';
import { IStore } from 'src/app/store/reducers';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ICategory } from 'src/app/store/reducers/categories.reducer';
import { getProductsPending } from './store/actions/products.actions';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getBrandsPending } from './store/actions/brands.actions';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { go } from 'src/app/store/actions/router.actions';

export interface IPriceData {
  value: number;
  highValue: number;
}

export interface IProductQuery {
  id?: string;
  name?: string;
  value?: string;
  highValue?: string;
  productName?: string;
  brandsQuery?: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent extends UnSubscriber implements OnInit {
  public categories$: Observable<ICategory[]> = this._store
    .select('categories', 'items')
    .pipe(takeUntil(this.unsubscribe$$));
  public show: string | undefined;
  public products$: Observable<IProduct[]> = this._store
    .select('products', 'items')
    .pipe(takeUntil(this.unsubscribe$$));
  public priceRange!: IPriceData;
  public productName = '';
  public selectedBrands: string[] = [];
  public form: FormGroup = this._fb.group({
    brand: [''],
    prices: [{}],
    currentSubCategory: [''],
    searchByName: [''],
  });

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _store: Store<IStore>
  ) {
    super();
  }

  public ngOnInit() {
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((formData) => {
      const index = this.selectedBrands.indexOf(formData.brand);
      if (index === -1) {
        this.selectedBrands.push(formData.brand);
      } else {
        this.selectedBrands.splice(index, 1);
      }
      this._store.dispatch(
        go({
          path: ['/category'],
          query: {
            brand: this.selectedBrands.join(','),
            subCatId: formData.currentSubCategory,
            searchByName: formData.searchByName,
            prices: `${formData.prices.low},${formData.prices.high}`,
          },
        })
      );
    });
    this._store.dispatch(getCategoriesPending());
    this._activatedRoute.queryParams.subscribe((query) => {
      if (query.brand) {
        this.selectedBrands = query.brand.split(',');
      }
      this._store.dispatch(
        getProductsPending({
          selectedBrands: query.brand,
          currentCategory: query.subCatId,
          searchByName: query.searchByName,
          priceRange: {
            value: query.prices.split(',')[0],
            highValue: query.prices.split(',')[1],
          },
        })
      );
      this._store.dispatch(
        getBrandsPending({
          id: query.subCatId,
          priceRange: {
            value: query.prices.split(',')[0],
            highValue: query.prices.split(',')[1],
          },
        })
      );

      this.form.setValue(
        {
          searchByName: query.searchByName ?? '',
          brand: '',
          currentSubCategory: query.subCatId,
          prices: {
            low: query.prices.split(',')[0],
            high: query.prices.split(',')[1],
          },
        },
        { emitEvent: false }
      );
    });
  }
}
