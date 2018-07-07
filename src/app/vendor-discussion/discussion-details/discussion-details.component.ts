import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { AuthInfo } from '../../models/authInfo';
import { User } from '../../models/loginUser';
import { CommonService } from '../../shared/services/common.service';
import { MessageService } from '../../shared/services/message.service';
import { ConfirmationService } from 'primeng/primeng';
import { DashboardService } from '../../services/dashboard.service';
import { AuthTokenService } from '../../shared/services/authToken.service';
import { Config } from '../../shared/config/config';
/**
 * This class represents the toolbar component.
 */
declare var saveAs: any;
@Component({
    moduleId: module.id,
    selector: 'app-discussion-details',
    templateUrl: 'discussion-details.component.html',
    styleUrls: ['discussion-details.component.css'],
    providers: [ConfirmationService]
})
export class DiscussionDetailsComponent implements OnChanges, AfterViewChecked {
    @Input() vdid: any = '';
    @Input() vcid: any = '';
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    rmsMenu: any[];
    details: any;
    discussion: any;
    showClose: boolean = false;
    showAttachment: boolean = false;
    currentUrl: any;
    errorMessage: string;
    loggedInData: any;
    attachmentURL: any = {};
    binaryFileToDownload: string;
    chatContent: any = '';
    parentDiscussion: any;
    routeUrl: any = '';
    disableFooter: boolean = false;
    vendorCommunicationData: any;

    constructor(private _router: Router, private _commonService: CommonService, private _messageService: MessageService,
        private _dashboardService: DashboardService, private _authTokenService: AuthTokenService) {
        this.attachmentURL = {
            'FileName': '',
            'ServerRelativeUrl': ''
        };
    }

    ngOnChanges() {
        this.discussion = [];
        this.parentDiscussion = [];
        this.routeUrl = '/vendor-discussion';
        if (this._authTokenService.authToken !== '') {
            this.loggedInData = JSON.parse(this._authTokenService.loggedInUserData);
            this.chatContent = '';
            this.currentUrl = this._router.url ? this._router.url : '';
            if (this.currentUrl.toString().toLowerCase().indexOf('vendor-communication') >= 0) {
                if (this.currentUrl.toString().toLowerCase().indexOf('view-request') >= 0) {
                    this.disableFooter = false;
                    this.getVendorCommunicationByID(this.vdid)
                } else {
                    this.disableFooter = true;
                }
                this.showClose = true;
            } else {
                this.showClose = false;
                this.getVendorDiscussionByID(this.vdid);
            }
            this.getDiscusssionBoardById(this.vdid);
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    getVendorCommunicationByID(id: any) {
        this._dashboardService.getVendorCommunicationByID(id)
            .subscribe(
            (results: any) => {
                this.vendorCommunicationData = results;
                this.vendorCommunicationData.Route = '/vendor-communication/view-request';
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
                this.details = results;
                this.showClose = false;
                this.showAttachment = true;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getDiscusssionBoardById(id: any) {
        this._dashboardService.getDiscusssionBoardById(id)
            .subscribe(
            (results: any) => {
                if (Object.keys(results).length > 0) {
                    this.parentDiscussion = results;
                    this.discussion = results.Messages;
                    if (this.discussion.length > 0) {
                        this.discussion.forEach(element => {
                            element.ModifiedBy1 = (element.ModifiedBy1 === null ? '' : element.ModifiedBy1);
                            if (element.ModifiedBy1.toLowerCase() === this.loggedInData.UserDetail.Name.toLowerCase()) {
                                element.CSSclass = 'me';
                                element.TextClass = 'text-me';
                            } else {
                                element.CSSclass = 'them';
                                element.TextClass = 'text-them';
                            }
                        });
                    }
                }
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
    onDownloadFile() {
        //Need to chanege API
        this._dashboardService.getDownloadedFileVD(this.attachmentURL.ServerRelativeUrl)
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
    onBack() {
        this._router.navigate(['/vendor-communication/view-request', this._commonService.VCID]);
    }
    onSendChat() {
        if (this.chatContent.trim() !== '') {
            if (this.currentUrl.toString().toLowerCase().indexOf('vendor-communication') >= 0) {
                let payload = {
                    reply: {
                        "Title": this.chatContent.slice(0, 200),
                        "Body": this.chatContent,
                        "ParentItemEditor": this.parentDiscussion.length === 0 ? null : this.parentDiscussion.Discussion.ParentItemEditor,
                        "ParentItemID": this.parentDiscussion.length === 0 ? '' : this.parentDiscussion.Discussion.ID,
                        "ModifiedBy": {
                            "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                            "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                            "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : '',
                        },
                        "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                        "CreatedBy": this.parentDiscussion.length === 0 ? null : this.parentDiscussion.Discussion.CreatedBy,
                        "CreatedBy1": this.parentDiscussion.length === 0 ? '' : this.parentDiscussion.Discussion.CreatedBy1,
                    },
                    "MainDiscussion":{},
                    "VCMainDiscussion": this.vendorCommunicationData

                }
                this._dashboardService.replyToChatWithMail(payload)
                    .subscribe(
                    (results: any) => {
                        this.getDiscusssionBoardById(this.vdid);
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
                this.chatContent = '';
            } else {
                let payload = {
                    Reply: {
                        "Title": this.chatContent.slice(0, 200),
                        "Body": this.chatContent,
                        "ParentItemEditor": this.parentDiscussion.length === 0 ? null : this.parentDiscussion.Discussion.ParentItemEditor,
                        "ParentItemID": this.parentDiscussion.length === 0 ? '' : this.parentDiscussion.Discussion.ID,
                        "ModifiedBy": {
                            "Title": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                            "Name": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                            "ID": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.ID : '',
                        },
                        "ModifiedBy1": this._authTokenService.loggedInUserData ? JSON.parse(this._authTokenService.loggedInUserData).UserDetail.Name : '',
                        "CreatedBy": this.parentDiscussion.length === 0 ? null : this.parentDiscussion.Discussion.CreatedBy,
                        "CreatedBy1": this.parentDiscussion.length === 0 ? '' : this.parentDiscussion.Discussion.CreatedBy1,
                    },
                    "MainDiscussion": {
                        "Title": this.parentDiscussion.Discussion.Title,
                        "Category": this.details ? this.details.Category : '',
                        "Vendor": this.details ? this.details.Vendor : '',
                        "ID": this.parentDiscussion.Discussion.ID,
                        "CreatedBy1": this.parentDiscussion.Discussion.CreatedBy1,
                        "DateTime": this.details ? this.details.DateTime : '',
                        "Comments": this.chatContent,
                        "Route": this.routeUrl
                    },
                    "VCMainDiscussion": {}
                }
                this._dashboardService.replyToChatWithMail(payload)
                    .subscribe(
                    (results: any) => {
                        this.getDiscusssionBoardById(this.vdid);
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
                this.chatContent = '';
            }
        }
    }
    onEnterKey(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.onSendChat();
        }
    }
}
