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

// Dashboard Components
import { DashboardComponent } from './dashboard/dashbpoard-page/dashboard.component';

// User Action
import { GLApprovalComponent } from './user-action/gl-action/gl-approval/gl-approval.component';
import { RequesterNeedInfoComponent } from './user-action/requester-action/requester-need-info/requester-need-info.component';
import { RequesterRequestCloseComponent } from './user-action/requester-action/requester-request-closed/requester-request-closed.component';
import { RequesterRequestSignoffComponent } from './user-action/requester-action/requester-request-signoff/requester-request-signoff.component';
import { GLRequestCloseComponent } from './user-action/gl-action/gl-request-closed/gl-request-closed.component';
import { CDApprovalComponent } from './user-action/cd-action/cd-approval/cd-approval.component';
import { CDRequestClouserComponent } from './user-action/cd-action/cd-request-clouser/cd-request-clouser.component';
import { VendorNeedInfoComponent } from './user-action/vendor-action/vendor-need-info/vendor-need-info.component';
import { VendorRequestClouserComponent } from './user-action/vendor-action/vendor-request-closure/vendor-request-clouser.component';

// Other Component
import { CreateVendorCommunicationComponent } from './create-vendor-communication/create-vendor-communication.component';
import { CreateVendorDiscussionComponent } from './create-vendor-discussion/create-vendor-discussion.component';
import { ReportComponent } from './report/report.component';
import { VendorCommunicationComponent } from './vendor-communication/vendor-communication.component';
import { VendorDiscussionComponent } from './vendor-discussion/vendor-discussion/vendor-discussion.component';
import { DiscussionDetailsComponent } from './vendor-discussion/discussion-details/discussion-details.component';
import { BrandNotifyComponent } from './admin/brand-notify/brand-notify.component';
import { PlantInfoListComponent } from './admin/plant-info-list/plant-info-list.component';
import { UnAuthorizedComponent } from './unAuthorized/unAuthorized.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { DiscussionLinkComponent } from './vendor-discussion/discussion-link/discussion-link.component';
import { AboutComponent } from './about-me/about-me.component';
import { VehicleLocationComponent } from './admin/vehicle-location/vehicle-location.component';
import { PurposeMasterComponent } from './admin/purpose-master/purpose-master.component';
import { VendorMappingComponent } from './admin/vendor-mapping/vendor-mapping.component';

// Services
import { DashboardService } from './services/dashboard.service';
import { AuthTokenService } from '../app/shared/services/authToken.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ReportComponent,
    CreateVendorCommunicationComponent,
    CreateVendorDiscussionComponent,
    VendorCommunicationComponent,
    VendorDiscussionComponent,
    DiscussionDetailsComponent,
    BrandNotifyComponent,
    PlantInfoListComponent,
    UnAuthorizedComponent,
    GLApprovalComponent,
    RequesterNeedInfoComponent,
    RequesterRequestCloseComponent,
    RequesterRequestSignoffComponent,
    GLRequestCloseComponent,
    CDApprovalComponent,
    CDRequestClouserComponent,
    VendorNeedInfoComponent,
    VendorRequestClouserComponent,
    ViewRequestComponent,
    DiscussionLinkComponent,
    AboutComponent,
    VehicleLocationComponent,
    PurposeMasterComponent,
    VendorMappingComponent
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
