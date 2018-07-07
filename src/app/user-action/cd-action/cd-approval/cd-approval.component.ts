import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../../../shared/services/common.service';
import { MessageService } from '../../../shared/services/message.service';
import { DashboardService } from '../../../services/dashboard.service';
import { slideInOutAnimation } from '../../../animation/index';
import { AuthTokenService } from '../../../shared/services/authToken.service';
import * as _ from 'lodash/index';
import { Config } from '../../../shared/config/config';
import { SpinnerService } from '../../../shared/spinner/spinner.service';

/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-cd-approval',
    templateUrl: 'cd-approval.component.html',
    styleUrls: ['cd-approval.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class CDApprovalComponent implements OnInit, OnDestroy {
    vendorCommunicationData: any;
    errorMessage: any;
    radioRequestType: any;
    show: boolean = false;
    // General Variables
    params: Params;
    currentUrl: any;
    type: any = '';
    vendorData: any[];
    showError: boolean = false;
    vendorErr: boolean = false;
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
        private _spinnerService: SpinnerService,
        private _authTokenService: AuthTokenService) {
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
                this.getVendor();
            });
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
    ngOnDestroy() {
        sessionStorage.removeItem('VCSID');
        sessionStorage.removeItem('Action');
    }
    getVendor() {
        this._commonService.getVendor()
            .subscribe(
            (results: any) => {
                this.vendorData = results;
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
                this.vendorCommunicationData.CDComments = this.vendorCommunicationData.CDComments ? this.vendorCommunicationData.CDComments : '';
                this._authTokenService.type = this.vendorCommunicationData.VendorCommunication ? this.vendorCommunicationData.VendorCommunication.toLowerCase() : '';
                if (this.vendorCommunicationData.CDApproval !== 'Pending') {
                    this.isApproved = true;
                }
                let ven = ''
                this.vendorCommunicationData.VendorContact.forEach(element => {
                    ven = ven + element + ',  ';
                });
                this.vendors = ven.replace(/,\s*$/, "");
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
        if (this.vendorCommunicationData.Requirement !== 'New Developement') {
            if (this.vendorCommunicationData.CDComments.trim() !== '' && this.vendorCommunicationData.CDComments.trim() !== null) {
                this.showError = false;
                this.routeUrl = '/vendor-communication/vendor-need-info';
                let payload = {
                    "ID": this.vendorCommunicationData.ID,
                    "Title": this.vendorCommunicationData.Title,
                    "Category": this.vendorCommunicationData.Category,
                    "VendorCommunication": this.vendorCommunicationData.VendorCommunication,
                    "Requirement": this.vendorCommunicationData.Requirement,
                    "VendorStatus": this.vendorCommunicationData.VendorStatus,
                    "GLStatus": this.vendorCommunicationData.GLStatus,
                    "CDStatus": 'Pending for Vendor Assign',
                    "Status": this.vendorCommunicationData.Status,
                    "GLApproval": this.vendorCommunicationData.GLApproval,
                    "CDApproval": 'Approved',
                    "VendorView": this.vendorCommunicationData.vendorview,
                    "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                    "CreatedBy1": this.vendorCommunicationData.CreatedBy1,
                    "Role": 'cd',
                    "Comments": this.vendorCommunicationData.CDComments,
                    "CDUsers": [
                        {
                            "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                            "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                            "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : ''
                        }
                    ],
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
        } else {
            if (this.vendorCommunicationData.Vendor !== null && this.vendorCommunicationData.Vendor !== '' && this.vendorCommunicationData.Vendor !== '--  Select Vendor --') {
                this.vendorErr = false;
                if (this.vendorCommunicationData.CDComments.trim() !== '' && this.vendorCommunicationData.CDComments.trim() !== null) {
                    this.showError = false;
                    let contactPerson: any = _.find(this.vendorData, { 'Name': this.vendorCommunicationData.Vendor })
                    this.routeUrl = '/vendor-communication/vendor-need-info';
                    let payload = {
                        "ID": this.vendorCommunicationData.ID,
                        "Title": this.vendorCommunicationData.Title,
                        "Category": this.vendorCommunicationData.Category,
                        "VendorCommunication": this.vendorCommunicationData.VendorCommunication,
                        "Requirement": this.vendorCommunicationData.Requirement,
                        "VendorStatus": this.vendorCommunicationData.VendorStatus,
                        "GLStatus": this.vendorCommunicationData.GLStatus,
                        "CDStatus": 'Assigned Vendor',
                        "Status": this.vendorCommunicationData.Status,
                        "GLApproval": this.vendorCommunicationData.GLApproval,
                        "CDApproval": 'Approved',
                        "VendorView": this.vendorCommunicationData.vendorview,
                        "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                        "CreatedBy1": this.vendorCommunicationData.CreatedBy1,
                        "Role": 'cd',
                        "Comments": this.vendorCommunicationData.CDComments,
                        "VendorName": this.vendorCommunicationData.Vendor,
                        "CDUsers": [
                            {
                                "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                                "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                                "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : ''
                            }
                        ],
                        "Vendors": contactPerson.ContactPersons,
                        "Brand": this.vendorCommunicationData.Brand,
                        "System": this.vendorCommunicationData.System,
                        "ItemID": this.vendorCommunicationData.ItemID,
                        "ItemDescription": this.vendorCommunicationData.ItemDescription,
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
            } else {
                this.vendorErr = true;
            }
        }

    }
    onReject() {
        if (this.vendorCommunicationData.CDComments.trim() !== '' && this.vendorCommunicationData.CDComments.trim() !== null) {
            this.showError = false;
            this.routeUrl = '/vendor-communication/view-request';
            let payload = {
                "ID": this.vendorCommunicationData.ID,
                "Title": this.vendorCommunicationData.Title,
                "Category": this.vendorCommunicationData.Category,
                "VendorCommunication": this.vendorCommunicationData.VendorCommunication,
                "Requirement": this.vendorCommunicationData.Requirement,
                "VendorStatus": this.vendorCommunicationData.VendorStatus,
                "GLStatus": this.vendorCommunicationData.GLStatus,
                "CDStatus": 'Rejected',
                "Status": this.vendorCommunicationData.Status,
                "GLApproval": this.vendorCommunicationData.GLApproval,
                "CDApproval": 'Rejected',
                "VendorView": this.vendorCommunicationData.vendorview,
                "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                "CreatedBy1": this.vendorCommunicationData.CreatedBy1,
                "Role": 'cd',
                "Comments": this.vendorCommunicationData.CDComments,
                "CDUsers": [
                    {
                        "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                        "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                        "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : ''
                    }
                ],
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
