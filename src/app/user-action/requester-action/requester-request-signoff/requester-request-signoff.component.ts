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
    selector: 'app-requester-request-signoff',
    templateUrl: 'requester-request-signoff.component.html',
    styleUrls: ['requester-request-signoff.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class RequesterRequestSignoffComponent implements OnInit, OnDestroy {
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
    heading: any = '';
    isApproved: boolean = false;
    routeUrl: any = '';
    VendorStatus: any = '';
    vendors: any = '';
    attachmentURL: any = {};
    filesData: any;
    fileName: string = '';
    fileError: boolean = false;
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
        this.filesData = new Array<File>();
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
    getStatus() {
        this._commonService.getStatus('vendor')
            .subscribe(
            (results: any) => {
                this.status = results;
                this._authTokenService.type = this.vendorCommunicationData.VendorCommunication ? this.vendorCommunicationData.VendorCommunication.toLowerCase() : '';
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
                let ven = ''
                this.vendorCommunicationData.VendorContact.forEach(element => {
                    ven = ven + element + ',  ';
                });
                this.vendors = ven.replace(/,\s*$/, "");
                switch (this.vendorCommunicationData.VendorStatus) {
                    case '04. Requesting for Designer - DIDS SignOff':
                        this.heading = 'Requesting for Designer - DIDS SignOff';
                        this.VendorStatus = '03. Info Updated / Request Approved';
                        this.status.push('03. Info Updated / Request Approved');
                        break;
                    case '05. Requesting for Designer - Drawing Approval':
                        this.heading = 'Requesting for Designer - Drawing Approval';
                        this.VendorStatus = '03. Info Updated / Request Approved';
                        this.status.push('03. Info Updated / Request Approved');
                        break;
                    case '07. Requesting for Designer - Sample Approval':
                        this.heading = 'Requesting for Designer - Sample Approval';
                        this.VendorStatus = '03. Info Updated / Request Approved';
                        this.status.push('03. Info Updated / Request Approved');
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
    postFile(inputValue: any): void {
        const format = /[!@#$%^&*+\=\[\]{};':'\\|,.<>\/?]+/;
        try {
            const FileList: FileList = inputValue.target.files;
            if (FileList.length > 0) {
                if (inputValue.target.files[0].name.split('.')[0].length <= 50) {
                    if (inputValue.target.files[0].size <= 52428800) {
                        if (inputValue.target.files[0].name.split('.')[1].toLowerCase() !== 'bat' &&
                            inputValue.target.files[0].name.split('.')[1].toLowerCase() !== 'exe') {
                            if (!format.test(inputValue.target.files[0].name.split('.')[0])) {
                                //this.filesData.length = 0;
                                let alreadyExist = false;
                                this.filesData.forEach(element => {
                                    if (element.name === FileList.item(0).name) {
                                        alreadyExist = true;
                                    }
                                });
                                if (!alreadyExist) {
                                    this.filesData.push(FileList.item(0));
                                    this.fileName = FileList.item(0).name;
                                    (<HTMLInputElement>document.getElementById('file_input_file')).value = '';
                                    this.fileError = false;
                                } else {
                                    (<HTMLInputElement>document.getElementById('file_input_file')).value = '';
                                    this._messageService.addMessage({
                                        severity: 'error', summary: 'Error Message',
                                        detail: 'You have already added this file. Please select different file.'
                                    });
                                }

                            } else {
                                (<HTMLInputElement>document.getElementById('file_input_file')).value = '';
                                this._messageService.addMessage({
                                    severity: 'error', summary: 'Error Message',
                                    detail: 'Please remove special characters from filename'
                                });
                            }
                        } else {
                            (<HTMLInputElement>document.getElementById('file_input_file')).value = '';
                            this._messageService.addMessage({
                                severity: 'error', summary: 'Error Message',
                                detail: 'Please upload document of type of supperted type'
                            });
                        }
                    } else {
                        (<HTMLInputElement>document.getElementById('file_input_file')).value = '';
                        this._messageService.addMessage({
                            severity: 'error', summary: 'Error Message',
                            detail: 'Please upload document of size less than 50 MB'
                        });
                    }
                } else {
                    (<HTMLInputElement>document.getElementById('file_input_file')).value = '';
                    this._messageService.addMessage({
                        severity: 'error', summary: 'Error Message',
                        detail: 'File name should not exceed 50 character length'
                    });
                }
            } else {
                // this.AttachmentURL = false;
                this.fileName = '';
            }
        } catch (error) {
            document.write(error);
        }

    }
    deleteUploadedFile(index: any) {
        this.filesData.splice(index, 1);
    }
    downloadFile(inputFile: any) {
        this.attachmentURL.FileName = inputFile.FileName;
        this.attachmentURL.ServerRelativeUrl = inputFile.ServerRelativeUrl;
        window.open(Config.getLogoURL() + this.attachmentURL.ServerRelativeUrl);
        //this.onDownloadFile();
    }
    onSave() {
        if (this.Comment.trim() !== '') {
            // if (this.vendorCommunicationData.VendorStatus === '04. Requesting for Designer - DIDS SignOff') {

            // }
            // if (this.vendorCommunicationData.VendorStatus === '05. Requesting for Designer - Drawing Approval') {

            // }
            // if (this.vendorCommunicationData.VendorStatus === '07. Requesting for Designer - Sample Approval') {

            // }
            this.showError = false;
            this.routeUrl = '/vendor-communication/vendor-need-info';
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
            let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
            if (isIEOrEdge) {
                this._spinnerService.show();
                this._dashboardService.userActions(payload)
                    .subscribe(
                    (results: any) => {
                        let message = results.Message;
                        if (this.filesData.length > 0) {
                            for (let i = 0; i < this.filesData.length; i++) {
                                this._dashboardService.AddVCAttachmentForIE(payload, this.filesData[i]).then(
                                    (results: any) => {
                                        if (i === this.filesData.length - 1) {
                                            this._spinnerService.hide();
                                            this._messageService.addMessage({
                                                severity: results === 'Attachment Added Successfully!' ? 'success' : 'error',
                                                summary: 'Success Message',
                                                detail: results === 'Attachment Added Successfully!' ? message : results
                                            });
                                            this.fileName = '';
                                            this._router.navigate(['/vendor-communication']);
                                        }
                                    },
                                    (error: any) => {
                                        this._spinnerService.hide();
                                        this.errorMessage = <any>error;
                                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                                    });
                            }
                        } else {
                            this._spinnerService.hide();
                            this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                            this._router.navigate(['/vendor-communication']);
                        }
                    },
                    error => {
                        this._spinnerService.hide();
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
            else {
                if (this.filesData.length > 0) {
                    this._spinnerService.show();
                    this._dashboardService.updateVendorCommunicationWithAtttachment(payload, this.filesData).then(
                        (results: any) => {
                            this._spinnerService.hide();
                            this._messageService.addMessage({
                                severity: 'success',
                                summary: 'Success Message',
                                detail: results
                            });
                            this.fileName = '';
                            this._router.navigate(['/vendor-communication']);
                        },
                        (error: any) => {
                            this._spinnerService.hide();
                            this.errorMessage = <any>error;
                            this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                        });
                } else {
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
                }
            }
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
