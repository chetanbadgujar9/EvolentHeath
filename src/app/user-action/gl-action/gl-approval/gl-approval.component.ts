import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../../../shared/services/common.service';
import { MessageService } from '../../../shared/services/message.service';
import { DashboardService } from '../../../services/dashboard.service';
import { slideInOutAnimation } from '../../../animation/index';
import { AuthTokenService } from '../../../shared/services/authToken.service';
import { Config } from '../../../shared/config/config';
import { SpinnerService } from '../../../shared/spinner/spinner.service';

/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-gl-approval',
    templateUrl: 'gl-approval.component.html',
    styleUrls: ['gl-approval.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class GLApprovalComponent implements OnInit, OnDestroy {
    vendorCommunicationData: any;
    errorMessage: any;
    radioRequestType: any;
    show: boolean = false;
    // General Variables
    params: Params;
    currentUrl: any;
    type: any = '';
    showError: boolean = false;
    isApproved: boolean = false;
    routeUrl: any = '';
    vendors: any = '';
    attachmentURL: any = {};
    vdID: any = '';
    constructor(private _router: Router,
        private _commonService: CommonService,
        private _messageService: MessageService,
        private _dashboardService: DashboardService,
        private route: ActivatedRoute,
        private _authTokenService: AuthTokenService,
        private _spinnerService: SpinnerService) {
            this.attachmentURL = {
                'FileName': '',
                'ServerRelativeUrl': ''
            };

    }
    ngOnInit() {
        if (this._authTokenService.authToken !== '') {
            this.route.params.forEach((params: Params) => {
                this.params = params['id'];
                this.vdID = this.params;
                this.getVendorCommunicationByID(this.params);
            });
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
    ngOnDestroy() {
        sessionStorage.removeItem('VCSID');
        sessionStorage.removeItem('Action');
    }
    getVendorCommunicationByID(id: any) {
        this._dashboardService.getVendorCommunicationByID(id)
            .subscribe(
            (results: any) => {
                this.vendorCommunicationData = results;
                this.vendorCommunicationData.GLComments = this.vendorCommunicationData.GLComments ? this.vendorCommunicationData.GLComments : '';
                this._authTokenService.type = this.vendorCommunicationData.VendorCommunication ? this.vendorCommunicationData.VendorCommunication.toLowerCase() : '';
                let ven = ''
                this.vendorCommunicationData.VendorContact.forEach(element => {
                    ven = ven + element + ',  ';
                });
                this.vendors = ven.replace(/,\s*$/, "");
                if (this.vendorCommunicationData.GLApproval !== 'Pending') {
                    this.isApproved = true;
                }
                this.show = true;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    downloadFile(inputFile: any) {
        this.attachmentURL.FileName = inputFile.FileName;
        this.attachmentURL.ServerRelativeUrl = inputFile.ServerRelativeUrl;
        window.open(Config.getLogoURL() + this.attachmentURL.ServerRelativeUrl);
        //this.onDownloadFile();
    }
    onApprove() {
        if (this.vendorCommunicationData.GLComments.trim() !== '' && this.vendorCommunicationData.GLComments.trim() !== null) {
            this.showError = false;
            if (this.vendorCommunicationData.Requirement === 'New Developement') {
                this.routeUrl = '/vendor-communication/cd-approval';
            } else {
                this.routeUrl = '/vendor-communication/vendor-need-info';
            }
            let payload = {
                "ID": this.vendorCommunicationData.ID,
                "Title": this.vendorCommunicationData.Title,
                "Category": this.vendorCommunicationData.Category,
                "VendorCommunication": this.vendorCommunicationData.VendorCommunication,
                "Requirement": this.vendorCommunicationData.Requirement,
                "VendorStatus": this.vendorCommunicationData.VendorStatus,
                "GLStatus": '02. Approved',
                "CDStatus": this.vendorCommunicationData.CDStatus,
                "Status": this.vendorCommunicationData.Status,
                "GLApproval": 'Approved',
                "CDApproval": this.vendorCommunicationData.CDApproval,
                "VendorView": this.vendorCommunicationData.vendorview,
                "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                "CreatedBy1": this.vendorCommunicationData.CreatedBy1,
                "Role": 'gl',
                "Comments": this.vendorCommunicationData.GLComments,
                "Brand": this.vendorCommunicationData.Brand,
                "System": this.vendorCommunicationData.System,
                "ItemID": this.vendorCommunicationData.ItemID,
                "ItemDescription": this.vendorCommunicationData.ItemDescription,
                "VendorName": this.vendorCommunicationData.Vendor,
                "Route": this.routeUrl,
                "ModifiedBy": {
                    "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                    "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                    "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : ''
                },
            }
            this._spinnerService.show();
            this._dashboardService.userActions(payload)
                .subscribe(
                (results: any) => {
                    this._spinnerService.hide();
                    this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                    this._router.navigate(['/vendor-communication']);
                },
                error => {
                    this._spinnerService.hide();
                    this.errorMessage = <any>error;
                    this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                });
        } else {
            this.showError = true;
        }
    }
    onReject() {
        if (this.vendorCommunicationData.GLComments.trim() !== '' && this.vendorCommunicationData.GLComments.trim() !== null) {
            this.showError = false;
            this.routeUrl = '/vendor-communication/view-request';
            let payload = {
                "ID": this.vendorCommunicationData.ID,
                "Title": this.vendorCommunicationData.Title,
                "Category": this.vendorCommunicationData.Category,
                "VendorCommunication": this.vendorCommunicationData.VendorCommunication,
                "Requirement": this.vendorCommunicationData.Requirement,
                "VendorStatus": this.vendorCommunicationData.VendorStatus,
                "GLStatus": '03. Rejected',
                "CDStatus": this.vendorCommunicationData.CDStatus,
                "Status": this.vendorCommunicationData.Status,
                "GLApproval": 'Rejected',
                "CDApproval": this.vendorCommunicationData.CDApproval,
                "VendorView": this.vendorCommunicationData.vendorview,
                "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                "CreatedBy1": this.vendorCommunicationData.CreatedBy1,
                "Role": 'gl',
                "Comments": this.vendorCommunicationData.GLComments,
                "Brand": this.vendorCommunicationData.Brand,
                "System": this.vendorCommunicationData.System,
                "ItemID": this.vendorCommunicationData.ItemID,
                "ItemDescription": this.vendorCommunicationData.ItemDescription,
                "VendorName": this.vendorCommunicationData.Vendor,
                "Route": this.routeUrl,
                "ModifiedBy": {
                    "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                    "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                    "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : ''
                },
            }
            this._spinnerService.show();
            this._dashboardService.userActions(payload)
                .subscribe(
                (results: any) => {
                    this._spinnerService.hide();
                    this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                    this._router.navigate(['/vendor-communication']);
                },
                error => {
                    this._spinnerService.hide();
                    this.errorMessage = <any>error;
                    this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                });
        } else {
            this.showError = true;
        }
    }
    onBack() {
        this._router.navigate(['/vendor-communication']);
    }
}
