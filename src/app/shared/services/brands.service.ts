import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPriceData } from 'src/app/content/category/category.component';

@Injectable()
export class BrandsService {
  constructor(private http: HttpClient) {}

public getBrands(id: string, prices: IPriceData ) {
  const priceRange = prices ? prices : {value: 0, highValue: 1000000000};
  return this.http.get(`/brands?subCat=${id}&prices=${priceRange.value},${priceRange.highValue}`);
  }
}