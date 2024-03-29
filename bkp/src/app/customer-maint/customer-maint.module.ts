import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@portinari/portinari-ui';

import { CustomerMaintRoutingModule } from './customer-maint-routing.module';
import { CustomerMaintListComponent } from './list/customer-maint.list.component';
import { CustomerMaintDetailComponent } from './detail/customer-maint.detail.component';
import { CustomerMaintEditComponent } from './edit/customer-maint.edit.component';


@NgModule({
    imports: [
        CommonModule,
        PoModule,
        FormsModule,
        HttpClientModule,
        CustomerMaintRoutingModule
    ],
    declarations: [
        CustomerMaintListComponent,
        CustomerMaintDetailComponent,
        CustomerMaintEditComponent
    ],
    exports: [
        CustomerMaintListComponent
    ],
    providers: [
    ],
})
export class CustomerMaintModule { }
