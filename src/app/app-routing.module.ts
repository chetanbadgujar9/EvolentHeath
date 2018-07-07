import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Dashboards
import { DashboardComponent } from './dashboard/dashbpoard-page/dashboard.component';

// User Actions
import { GLApprovalComponent } from './user-action/gl-action/gl-approval/gl-approval.component';
import { RequesterNeedInfoComponent } from './user-action/requester-action/requester-need-info/requester-need-info.component';
import { RequesterRequestCloseComponent } from './user-action/requester-action/requester-request-closed/requester-request-closed.component';
import { RequesterRequestSignoffComponent } from './user-action/requester-action/requester-request-signoff/requester-request-signoff.component';
import { GLRequestCloseComponent } from './user-action/gl-action/gl-request-closed/gl-request-closed.component';
import { CDApprovalComponent } from './user-action/cd-action/cd-approval/cd-approval.component';
import { CDRequestClouserComponent } from './user-action/cd-action/cd-request-clouser/cd-request-clouser.component';
import { VendorNeedInfoComponent } from './user-action/vendor-action/vendor-need-info/vendor-need-info.component';
import { VendorRequestClouserComponent } from './user-action/vendor-action/vendor-request-closure/vendor-request-clouser.component';

// Other Components
import { ReportComponent } from './report/report.component';
import { CreateVendorCommunicationComponent } from './create-vendor-communication/create-vendor-communication.component';
import { CreateVendorDiscussionComponent } from './create-vendor-discussion/create-vendor-discussion.component';
import { VendorCommunicationComponent } from './vendor-communication/vendor-communication.component';
import { VendorDiscussionComponent } from './vendor-discussion/vendor-discussion/vendor-discussion.component';
import { BrandNotifyComponent } from './admin/brand-notify/brand-notify.component';
import { PlantInfoListComponent } from './admin/plant-info-list/plant-info-list.component';
import { UnAuthorizedComponent } from './unAuthorized/unAuthorized.component';
import { ViewRequestComponent } from './view-request/view-request.component';
import { DiscussionLinkComponent } from './vendor-discussion/discussion-link/discussion-link.component';
import { AboutComponent } from './about-me/about-me.component';
import { VehicleLocationComponent } from './admin/vehicle-location/vehicle-location.component';
import { PurposeMasterComponent } from './admin/purpose-master/purpose-master.component';
import { VendorMappingComponent } from './admin/vendor-mapping/vendor-mapping.component';

const routes: Routes = [
    { path: 'vcs-dashboard', component: DashboardComponent },
    { path: 'report', component: ReportComponent },
    { path: 'aboutMe', component: AboutComponent },
    { path: 'vendor-communication', component: VendorCommunicationComponent },
    {
        path: 'vendor-communication', component: VendorCommunicationComponent,
        children: [
            {
                path: 'create-vendor-communication', component: CreateVendorCommunicationComponent
            },
            {
                path: 'view-request/:id', component: ViewRequestComponent,
            },
            {
                path: 'gl-approval/:id', component: GLApprovalComponent
            },
            {
                path: 'requester-need-info/:id', component: RequesterNeedInfoComponent
            },
            {
                path: 'requester-request-close/:id', component: RequesterRequestCloseComponent
            },
            {
                path: 'requester-request-signoff/:id', component: RequesterRequestSignoffComponent
            },
            {
                path: 'gl-request-close/:id', component: GLRequestCloseComponent
            },
            {
                path: 'cd-approval/:id', component: CDApprovalComponent
            },
            {
                path: 'cd-clouser/:id', component: CDRequestClouserComponent
            },
            {
                path: 'vendor-need-info/:id', component: VendorNeedInfoComponent
            },
            {
                path: 'vendor-request-clouser/:id', component: VendorRequestClouserComponent
            },
            { 
                path: 'discussion-link/:id', component: DiscussionLinkComponent
            }
        ]
    },
    { path: 'vendor-discussion', component: VendorDiscussionComponent },
    {
        path: 'vendor-discussion', component: VendorDiscussionComponent,
        children: [
            {
                path: 'create-vendor-discussion', component: CreateVendorDiscussionComponent
            },
            {
                path: 'view-request/:id', component: ViewRequestComponent
            }
        ]
    },
    { path: 'brand-notify', component: BrandNotifyComponent },
    { path: 'plant', component: PlantInfoListComponent },
    { path: 'vehicle-location', component: VehicleLocationComponent },
    { path: 'purpose', component: PurposeMasterComponent },
    { path: 'vendor-mapping', component: VendorMappingComponent },
    { path: 'unauthorized/:id', component: UnAuthorizedComponent },
    { path: 'vendor-discussion/:id', component: VendorDiscussionComponent },
    { path: '**', redirectTo: 'vcs-dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
