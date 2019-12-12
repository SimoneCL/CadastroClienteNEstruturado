import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDashComponent } from './customer-dash.component';

const routes: Routes = [
 {
   path: '',
   component: CustomerDashComponent
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDashRoutingModule { }
