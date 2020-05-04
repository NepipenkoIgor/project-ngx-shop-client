import { IStore } from 'src/app/store/reducers';
import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/interfaces/category.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/shared/services/category.service';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/shared/services/products.service';
import { IProduct, IPriceData, IProductQuery } from 'src/app/interfaces/product.interface';
import { addProductToCart } from 'src/app/store/actions/cart.actions';
import { Store } from '@ngrx/store';
import { BrandsService } from 'src/app/shared/services/brands.service';
import { getProductsPending } from 'src/app/store/actions/products.actions';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass'],
})
export class ProductListComponent implements OnInit {

  public categories$: Observable<ICategory[]> | undefined;
  public show: string | undefined;
  public isShow = false;
  public currentIndex: number | null = null;
  public query!: IProductQuery;
  public products$: Observable<any>
  = this.store.select(
    'products', 'items'
  );
  public priceRange!: IPriceData;
  public productName = '';
  public brands: any;
  public selectedBrands = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private store: Store<IStore>,
    public productsService: ProductsService,
    public brandsService: BrandsService
  ) {}


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
         query => this.getProductsByIdCategory(query, this.priceRange, this.selectedBrands));
    this.categories$ = this.categoriesService.getCategories();
  }
  public hover(index: number) {
    this.currentIndex = index;
    this.isShow = !this.isShow;
  }

  public getProductsByIdCategory( query: any, priceRange: IPriceData, selectedBrands: string){
    this.query = query;
    const search = { id: query.id, priceRange, productName: query.name, selectedBrands} ;
    this.store.dispatch(getProductsPending(search));
    this.brandsService.getBrands(query.id, priceRange).subscribe( brands => this.brands = brands);
  }

  public pricesValue( priceRange: IPriceData ){
    this.priceRange = priceRange;
    this.addPriceToQuery(priceRange);
  }

  public addPriceToQuery(priceRange: IPriceData) {
    const  {id, name} = this.query;
    const{value, highValue} = priceRange;
    if (priceRange){
    this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: { id, name, value, highValue }});
    }
  }

  public addProductNameToQuery(productName: string) {
    this. productName = productName;
    const  {id, name, value, highValue} = this.query;
    if (productName){
      this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: { id, name, value, highValue, productName }});
      }
  }

  public async addToBusket(product: IProduct): Promise<void> {
    this.store.dispatch(addProductToCart({ product }));
  }



  public getBrands(brands: string[]){
    const brandsForQuery = brands.join(',');
    this.selectedBrands = brandsForQuery;
    const  {id, name, value, highValue, productName} = this.query;
    if (brands.join(',')){
      this.router.navigate(['.'], { relativeTo: this.activatedRoute,
        queryParams: { id, name, value, highValue, productName, brandsQuery: brandsForQuery }});
    }
    const  {brandsQuery } = this.query;
    if ( brandsQuery ){
      if ( brandsForQuery < brandsQuery && brandsForQuery.length === 0) {
          this.router.navigate(['.'], { relativeTo: this.activatedRoute,
            queryParams: { id, name, value, highValue, productName }});
        }
    }
  }
 }
