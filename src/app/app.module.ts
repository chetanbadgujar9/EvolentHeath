import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
// PrimeNg Modules
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';


// Other Component
import { AddContactComponent } from './contact-list/add-contact/add-contact.component';
import { ContactListComponent } from './contact-list/contact-list/contact-list.component';
import { UpdateContactComponent } from './contact-list/update-contact/update-contact.component';

// Services
import { ContactService } from './services/contact.service';

@NgModule({
  declarations: [
    AppComponent,
    AddContactComponent,
    ContactListComponent,
    UpdateContactComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: APP_BASE_HREF, useValue: '/' }, ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
