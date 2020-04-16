import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: any, currency: string, symbol: boolean = false): string {
    if (value != null) {
      return this.currencyPipe.transform(value, currency, symbol);
    }
    return this.currencyPipe.transform(0, currency, symbol).split('0.00')[0];
  }
}
