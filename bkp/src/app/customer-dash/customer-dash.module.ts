import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDashRoutingModule } from './customer-dash-routing.module';
import { CustomerDashComponent } from './customer-dash.component';
import { FormsModule } from '@angular/forms';
import { PoModule, PoFieldModule, PoTableModule } from '@portinari/portinari-ui';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    CustomerDashComponent
  ],
  imports: [
    CommonModule,
    CustomerDashRoutingModule,
    PoModule,
    PoTableModule,
    FormsModule,
    HttpClientModule
  ]
})
export class CustomerDashModule { }
