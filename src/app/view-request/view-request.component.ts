import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../shared/services/common.service';
import { MessageService } from '../shared/services/message.service';
import { DashboardService } from '../services/dashboard.service';
import { slideInOutAnimation } from '../animation/index';
import { AuthTokenService } from '../shared/services/authToken.service';
import { Config } from '../shared/config/config';

/**
 * This class represents the toolbar component.
 */
declare var saveAs: any;
@Component({
    moduleId: module.id,
    selector: 'app-view-request',
    templateUrl: 'view-request.component.html',
    styleUrls: ['view-request.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class ViewRequestComponent implements OnInit, OnDestroy {
    vendorCommunicationData: any;
    errorMessage: any;
    radioRequestType: any;
    attachmentURL: any = {};
    show: boolean = false;
    // General Variables
    params: Params;
    currentUrl: any;
    type: any = '';
    vdID: any = '';
    binaryFileToDownload: string;
    bgImage: any = '';
    vendors: any = '';
    cds: any = '';
    notifys: any = '';
    GLStatus: any = '';
    VendorStatus: any = '';
    constructor(private _router: Router,
        private _commonService: CommonService,
        private _messageService: MessageService,
        private _dashboardService: DashboardService,
        private route: ActivatedRoute,
        private _authTokenService: AuthTokenService) {
        this.attachmentURL = {
            'FileName': '',
            'ServerRelativeUrl': ''
        };
    }
    ngOnInit() {
        this.bgImage = this._authTokenService.Image3;
        if (this._authTokenService.authToken !== '') {
            this.route.params.forEach((params: Params) => {
                this.params = params['id'];
                this.vdID = this.params;
                this.currentUrl = this._router.url ? this._router.url : '';
                if (this.currentUrl.toString().toLowerCase().indexOf('vendor-communication') >= 0) {
                    this.type = 'communication';
                    this.getVendorCommunicationByID(this.params);
                } else {
                    this.type = 'discussion';
                    this.getVendorDiscussionByID(this.params);
                }
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
                this._authTokenService.type = this.vendorCommunicationData.VendorCommunication ? this.vendorCommunicationData.VendorCommunication.toLowerCase() : '';
                this.GLStatus = this.vendorCommunicationData.GLStatus ? (this.vendorCommunicationData.GLStatus.split('.')[1]) : '';
                this.VendorStatus = this.vendorCommunicationData.VendorStatus ? (this.vendorCommunicationData.VendorStatus.split('.')[1]) : '';
                let ven = ''
                this.vendorCommunicationData.VendorContact.forEach(element => {
                    ven = ven + element + ',  ';
                });
                this.vendors = ven.replace(/,\s*$/, "");
                let cd = ''
                this.vendorCommunicationData.CDContact.forEach(element => {
                    cd = cd + element + ',  ';
                });
                this.cds = cd.replace(/,\s*$/, "");
                let notify = ''
                this.vendorCommunicationData.Notify.forEach(element => {
                    notify = notify + element + ',  ';
                });
                this.notifys = notify.replace(/,\s*$/, "");
                this.show = true;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getVendorDiscussionByID(id: any) {
        this._dashboardService.getVendorDiscussionByID(id)
            .subscribe(
            (results: any) => {
                this.vendorCommunicationData = results;
                this.show = true;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onBack() {
        this.currentUrl = this._router.url ? this._router.url : '';
        if (this.currentUrl.toString().toLowerCase().indexOf('vendor-communication') >= 0) {
            this._router.navigate(['/vendor-communication']);
        } else {
            this._router.navigate(['/vendor-discussion']);
        }
    }
    onDiscussionLink(link: any) {
        this._commonService.VCID = this.params;
        let vdid = link.split('VD')[1];
        this._router.navigate(['/vendor-communication/discussion-link', 'VD' + vdid]);
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
                break;
            default:
                break;
        }
    }
}
