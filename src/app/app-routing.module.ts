import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
        path: 'customerMaint',
        loadChildren: './customer-maint/customer-maint.module#CustomerMaintModule'
    },
    {
        path: 'customerDash',
        loadChildren: './customer-dash/customer-dash.module#CustomerDashModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
