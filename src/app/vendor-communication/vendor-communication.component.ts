import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthInfo } from '../models/authInfo';
import { CommonService } from '../shared/services/common.service';
import { MessageService } from '../shared/services/message.service';
import { DashboardService } from '../services/dashboard.service';
import { element } from 'protractor';
import { Replace } from '../shared/config/replace';
import * as _ from 'lodash/index';
import { Observable } from 'rxjs/Rx';
import { AuthTokenService } from '../shared/services/authToken.service';
import { Config } from '../shared/config/config';
/**
 * This class represents the toolbar component.
 */
declare var saveAs: any;
@Component({
    moduleId: module.id,
    selector: 'app-vendor-communication',
    templateUrl: 'vendor-communication.component.html',
    styleUrls: ['vendor-communication.component.css']
})
export class VendorCommunicationComponent implements OnInit {
    _tempData: any[];
    attachmentURL: any = {};
    errorMessage: any;
    userRole: any = '';
    binaryFileToDownload: string;
    loggedInUserDetails: any;
    requestColor: any = '#007399;';
    noticeColor: any = '#03a9f4';
    request: any = '';
    notice: any = '';
    requestCounter: any = 0;
    noticeCounter: any = 0;
    type: any = '';
    constructor(private _commonService: CommonService, private _messageService: MessageService,
        private _router: Router, private formBuilder: FormBuilder, private _dashboardService: DashboardService,
        private _authTokenService: AuthTokenService) {
        this.attachmentURL = {
            'FileName': '',
            'ServerRelativeUrl': ''
        };
    }

    ngOnInit() {
        this._tempData = [];
        this.request = 'request';
        this.notice = 'notice';
        if (this._authTokenService.authToken !== '' && this._authTokenService.loggedInUserName !== '') {
            this.userRole = this._authTokenService.loggedInUserRole;
            this.loggedInUserDetails = JSON.parse(this._authTokenService.loggedInUserData);
            if (this._authTokenService.type === 'request' && this.userRole !== 'vendor') {
                this.onRequest();
            } else {
                this.onNotice();
            }
        } else {
            this._router.navigate(['/unauthorized', 1]);
        }
    }
    onRequest() {
        this.requestColor = '#007399';
        this.noticeColor = '#03a9f4';
        this._authTokenService.type = this.type = 'request';
        let username = this.loggedInUserDetails ? this.loggedInUserDetails.UserDetail.Name : '';

        this._tempData = [];
        switch (this.userRole) {
            case 'designer': this.getVendorCommunication_Designer(username, this.request);
                break;
            case 'gl': this.getVendorCommunication_GL(username, this.request);
                break;
            case 'cd': this.getVendorCommunication_CD(username, this.request);
                break;
            case 'vendor': this.getVendorCommunication_Vendor(username, this.request);
                break;
            default: this.getVendorCommunicationData();
                break;
        }
    }
    onNotice() {
        this.requestColor = '#03a9f4';
        this.noticeColor = '#007399';
        this._authTokenService.type = this.type = 'notice';
        let username = this.loggedInUserDetails ? this.loggedInUserDetails.UserDetail.Name : '';

        this._tempData = [];
        switch (this.userRole) {
            case 'designer': this.getVendorCommunication_Designer(username, this.notice);
                break;
            case 'gl': this.getVendorCommunication_GL(username, this.notice);
                break;
            case 'cd': this.getVendorCommunication_CD(username, this.notice);
                break;
            case 'vendor': this.getVendorCommunication_Vendor(username, this.notice);
                break;
            default: this.getVendorCommunicationData();
                break;
        }
    }
    getVendorCommunicationData() {
        this._dashboardService.getVendorCommunication()
            .subscribe(
            (results: any) => {
                this._tempData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getVendorCommunication_Designer(username: any, type: any) {
        this._dashboardService.getVendorCommunication_Designer(username, type)
            .subscribe(
            (results: any) => {
                //this._tempData = results;
                this._tempData = results.Result;
                this.requestCounter = results.RequestCount;
                this.noticeCounter = results.NoticeCount;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getVendorCommunication_GL(username: any, type: any) {
        this._dashboardService.getVendorCommunication_GL(username, type)
            .subscribe(
            (results: any) => {
                //this._tempData = results;
                this._tempData = results.Result;
                this.requestCounter = results.RequestCount;
                this.noticeCounter = results.NoticeCount;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getVendorCommunication_CD(username: any, type: any) {
        this._dashboardService.getVendorCommunication_CD(username, type)
            .subscribe(
            (results: any) => {
                //this._tempData = results;
                this._tempData = results.Result;
                this.requestCounter = results.RequestCount;
                this.noticeCounter = results.NoticeCount;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getVendorCommunication_Vendor(username: any, type: any) {
        this._dashboardService.getVendorCommunication_Vendor(username, type)
            .subscribe(
            (results: any) => {
                //this._tempData = results;
                this._tempData = results.Result;
                this.requestCounter = results.RequestCount;
                this.noticeCounter = results.NoticeCount;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    rowCouter(status: any) {
        let len = _.filter(this._tempData, { 'Status': status }).length;
        return len;
    }
    onViewRequest(request: any) {
        this._router.navigate(['/vendor-communication/view-request', request.Title]);
    }
    onSelectRequest(request: any) {
        switch (this.userRole) {
            case 'designer': if (request.Status === '02-Pending with Designer for info') {
                this._router.navigate(['/vendor-communication/requester-need-info', request.Title]);
            }
            else if (request.Status === '07-Pending with Designer for Closure') {
                this._router.navigate(['/vendor-communication/requester-request-close', request.Title]);
            }
            else if (request.Status === '03-Pending with Designer for DIDS SignOff') {
                this._router.navigate(['/vendor-communication/requester-request-signoff', request.Title]);
            }
            else if (request.Status === '04-Pending with Designer for Drawing Approval') {
                this._router.navigate(['/vendor-communication/requester-request-signoff', request.Title]);
            }
            else if (request.Status === '06-Pending with Designer for Sample Approval') {
                this._router.navigate(['/vendor-communication/requester-request-signoff', request.Title]);
            }
            else {

            }
                break;
            case 'gl': if (request.Status === '01-GL Approval Pending') {
                this._router.navigate(['/vendor-communication/gl-approval', request.Title]);
            }
                if (request.Status === '08-Pending with GL for Closure') {
                    this._router.navigate(['/vendor-communication/gl-request-close', request.Title]);
                }
                break;
            case 'cd': if (request.Status === '02-CD Approval Pending') {
                this._router.navigate(['/vendor-communication/cd-approval', request.Title]);
            }
                if (request.Status === '09-Pending with CD for Closure' || request.Status === '05-Pending with CD for Commercials') {
                    this._router.navigate(['/vendor-communication/cd-clouser', request.Title]);
                }
                break;
            case 'vendor': if (request.Status === '01-Pending with Vendor') {
                this._router.navigate(['/vendor-communication/vendor-need-info', request.Title]);
            }
                break;
        }
    }
    downloadFile(inputFile: any) {
        this.attachmentURL.FileName = inputFile.FileName;
        this.attachmentURL.ServerRelativeUrl = inputFile.ServerRelativeUrl;
        window.open(Config.getLogoURL() + this.attachmentURL.ServerRelativeUrl);
        //this.onDownloadFile();
    }
    onDownloadFile() {
        //Need to chanege API
        this._dashboardService.getDownloadedFileVC(this.attachmentURL.ServerRelativeUrl)
            .subscribe(
            results => {
                this.binaryFileToDownload = <any>results;
                if (this.binaryFileToDownload) {
                    this.Download(this.binaryFileToDownload, this.attachmentURL.ServerRelativeUrl, this.attachmentURL.FileName);
                } else { this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: 'File Not Found' }); }
            },
            error => this.errorMessage = <any>error);
    }
    Download(binaryResume: string, attachmentURL: string, FileName: string) {
        let extension;
        let fileName;
        if (FileName !== null) {
            extension = FileName.split('.')[1] ? FileName.split('.')[1] : 'VCSExt';
            fileName = FileName.split('.')[0] ? FileName.split('.')[0] : 'VCSFile';
        }
        var byteCharacters = atob(binaryResume);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);

        switch (extension.toLowerCase()) {
            case 'pdf': var blob1 = new Blob([byteArray], { type: "application/pdf;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'xls': var blob1 = new Blob([byteArray], { type: "application/vnd.ms-excel;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'xlsx': var blob1 = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'tif': var blob1 = new Blob([byteArray], { type: "image/tiff;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'tiff': var blob1 = new Blob([byteArray], { type: "image/tiff;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'gif': var blob1 = new Blob([byteArray], { type: "image/GIF;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'jpeg': var blob1 = new Blob([byteArray], { type: "image/jpeg;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'jpg': var blob1 = new Blob([byteArray], { type: "image/jpeg;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'png': var blob1 = new Blob([byteArray], { type: "image/png,charset=utf-8" });
                new saveAs(blob1, fileName + '.' + extension);
                break;
            case 'ppt': var blob1 = new Blob([byteArray], { type: "application/vnd.ms-powerpoint;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'pptx': var blob1 = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'doc':
                var blob1 = new Blob([byteArray], { type: "application/msword;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'docx':
                var blob1 = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'zip': var blob1 = new Blob([byteArray], { type: "application/zip;charset=utf-8;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'txt': var blob1 = new Blob([byteArray], { type: "application/octet-stream;charset=utf-16le;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'bmp': var blob1 = new Blob([byteArray], { type: "image/x-windows-bmp;charset=utf-16le;base64" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'rar': var blob1 = new Blob([byteArray], { type: "application/x-rar-compressed, application/octet-stream" });
                new saveAs(blob1, fileName + '.' + extension)
                break;
            case 'nxl': var blob1 = new Blob([byteArray], { type: "application/octet-stream" });
                new saveAs(blob1, fileName + '.' + extension)
                //var url = window.URL.createObjectURL(blob1);
                //window.open(Config.getLogoURL() + attachmentURL);
                break;
            default:
                break;
        }
    }
    // toggleRowGroup(rowGroup) {
    //     this.rowGroupMetadata[rowGroup].toggle = !this.rowGroupMetadata[rowGroup].toggle
    // }
}
