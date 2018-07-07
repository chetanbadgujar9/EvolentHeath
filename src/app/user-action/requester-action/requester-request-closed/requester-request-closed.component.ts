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
    selector: 'app-requester-request-close',
    templateUrl: 'requester-request-closed.component.html',
    styleUrls: ['requester-request-closed.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class RequesterRequestCloseComponent implements OnInit, OnDestroy {
    vendorCommunicationData: any;
    errorMessage: any;
    radioRequestType: any;
    show: boolean = false;
    // General Variables
    params: Params;
    currentUrl: any;
    type: any = '';
    status: any;
    Comment: any = '';
    showError: boolean = false;
    isApproved: boolean = false;
    routeUrl: any = '';
    btnName: any = 'Request Close';
    VendorStatus: any = '';
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
        this.status = [];

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
    onStatus(val) {
        if (val === '11. Designer Closure Rejected') {
            this.btnName = 'Closure Reject';
        } else {
            this.btnName = 'Request Close';
        }
    }
    getStatus() {
        this._commonService.getStatus('vendor')
            .subscribe(
            (results: any) => {
                this.status = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getVendorCommunicationByID(id: any) {
        this._dashboardService.getVendorCommunicationByID(id)
            .subscribe(
            (results: any) => {
                this.vendorCommunicationData = results;
                this.Comment = '';
                this._authTokenService.type = this.vendorCommunicationData.VendorCommunication ? this.vendorCommunicationData.VendorCommunication.toLowerCase() : '';
                let ven = ''
                this.vendorCommunicationData.VendorContact.forEach(element => {
                    ven = ven + element + ',  ';
                });
                this.vendors = ven.replace(/,\s*$/, "");
                switch (this.vendorCommunicationData.VendorStatus) {
                    case '08. Request for - Closure':
                        //this.status.push('05. Requesting for Designer - Drawing Approval');
                        this.VendorStatus = '10. Designer Closed';
                        this.status.push('10. Designer Closed');
                        this.status.push('11. Designer Closure Rejected');
                        break;
                    case '09. Designer Closure Pending':
                        //this.status.push('05. Requesting for Designer - Drawing Approval');
                        this.VendorStatus = '10. Designer Closed';
                        this.status.push('10. Designer Closed');
                        this.status.push('11. Designer Closure Rejected');
                        break;
                    default: this.getStatus();
                        this.isApproved = true;
                        break;
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
    onRequestClose() {
        if (this.Comment.trim() !== '') {
            this.showError = false;
            if (this.vendorCommunicationData.Requirement === 'New Developement') {
                if (this.VendorStatus === '10. Designer Closed') {
                    this.routeUrl = '/vendor-communication/cd-clouser';
                } else {
                    this.routeUrl = '/vendor-communication/vendor-need-info';
                }
            } else {
                if (this.VendorStatus === '10. Designer Closed') {
                    this.routeUrl = '/vendor-communication/gl-request-close';
                } else {
                    this.routeUrl = '/vendor-communication/vendor-need-info';
                }
            }
            let payload = {
                "ID": this.vendorCommunicationData.ID,
                "Title": this.vendorCommunicationData.Title,
                "Category": this.vendorCommunicationData.Category,
                "VendorCommunication": this.vendorCommunicationData.VendorCommunication,
                "Requirement": this.vendorCommunicationData.Requirement,
                "VendorStatus": this.VendorStatus,
                "GLStatus": this.vendorCommunicationData.GLStatus,
                "CDStatus": this.vendorCommunicationData.CDStatus,
                "Status": this.vendorCommunicationData.Status,
                "GLApproval": this.vendorCommunicationData.GLApproval,
                "CDApproval": this.vendorCommunicationData.CDApproval,
                "VendorView": this.vendorCommunicationData.vendorview,
                "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                "CreatedBy1": this.vendorCommunicationData.CreatedBy1,
                "Role": 'designer',
                "Comments": this.Comment,
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
        this.currentUrl = this._router.url ? this._router.url : '';
        if (this.currentUrl.toString().toLowerCase().indexOf('vendor-communication') >= 0) {
            this._router.navigate(['/vendor-communication']);
        } else {
            this._router.navigate(['/vendor-discussion']);
        }
    }
}
