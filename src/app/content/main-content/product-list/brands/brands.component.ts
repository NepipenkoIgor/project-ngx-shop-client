import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.sass']
})
export class BrandsComponent{
  @Input() brands: string[];
  public isShow = false;
  public show(){
    this.isShow = !this.isShow;
  }
 }
