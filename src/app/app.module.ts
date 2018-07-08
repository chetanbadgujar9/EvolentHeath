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
import { CreateVendorCommunicationComponent } from './create-vendor-communication/create-vendor-communication.component';
import { VendorCommunicationComponent } from './vendor-communication/vendor-communication.component';
import { ViewRequestComponent } from './view-request/view-request.component';

// Services
import { DashboardService } from './services/dashboard.service';
import { AuthTokenService } from '../app/shared/services/authToken.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateVendorCommunicationComponent,
    VendorCommunicationComponent,
    ViewRequestComponent
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
  { provide: APP_BASE_HREF, useValue: '/' }, DashboardService, AuthTokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
