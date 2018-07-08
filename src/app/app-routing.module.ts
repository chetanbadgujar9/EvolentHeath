import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Other Components
import { CreateVendorCommunicationComponent } from './create-vendor-communication/create-vendor-communication.component';
import { VendorCommunicationComponent } from './vendor-communication/vendor-communication.component';
import { ViewRequestComponent } from './view-request/view-request.component';

const routes: Routes = [
    { path: 'vendor-communication', component: VendorCommunicationComponent },
    {
        path: 'vendor-communication', component: VendorCommunicationComponent,
        children: [
            {
                path: 'create-vendor-communication', component: CreateVendorCommunicationComponent
            },
            {
                path: 'view-request/:id', component: ViewRequestComponent,
            }
        ]
    },
    { path: '**', redirectTo: 'vendor-communication', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
