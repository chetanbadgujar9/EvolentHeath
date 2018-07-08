import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Other Components
import { AddContactComponent } from './contact-list/add-contact/add-contact.component';
import { ContactListComponent } from './contact-list/contact-list/contact-list.component';
import { UpdateContactComponent } from './contact-list/update-contact/update-contact.component';

const routes: Routes = [
    { path: 'contact-list', component: ContactListComponent },
    {
        path: 'contact-list', component: ContactListComponent,
        children: [
            {
                path: 'add-contact', component: AddContactComponent
            },
            {
                path: 'update-contact/:id', component: UpdateContactComponent,
            }
        ]
    },
    { path: '**', redirectTo: 'contact-list', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
