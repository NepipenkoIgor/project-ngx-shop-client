import { reducers, CustomRouterSerializer } from './store/reducers/index';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects';
import { ProductComponent } from './content/category/product/product.component';
import { ProductsModule } from './content/products/products.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductComponent,
    FooterComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    ProductsModule,
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterSerializer,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
