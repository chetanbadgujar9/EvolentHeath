import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { slideInOutAnimation } from '../animation/index';
import { AuthTokenService } from '../shared/services/authToken.service';
import { CommonService } from '../shared/services/common.service';
import { MessageService } from '../shared/services/message.service';
import { VendorDiscussion } from '../models/vendor-discussion';
import { DashboardService } from '../services/dashboard.service';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create-vendor-discussion.component.html',
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})

export class CreateVendorDiscussionComponent implements OnInit {
    title = "Add Product";
    product: any = {};
    categoryData: any[];
    vendorData: any[];
    loggedInUserDetails: any;

    errorMessage: any;
    errorFlagForAdd: boolean = false;
    fileError: boolean = false;
    minDate: Date;
    /**Form Variables */
    vendorDiscussionForm: FormGroup;

    filesData: any;
    attachmentURL: any = {};
    fileName: string = '';
    disableSubmit: boolean = false;
    bgImage: any = '';
    routeUrl: any = '';
    constructor(
        private route: ActivatedRoute,
        private _router: Router,
        private _authTokenService: AuthTokenService,
        private _commonService: CommonService,
        private _messageService: MessageService,
        private formBuilder: FormBuilder,
        private _dashboardService: DashboardService,
        private _spinnerService: SpinnerService) {
        this.filesData = new Array<File>();
    }

    ngOnInit() {
        this.bgImage = this._authTokenService.Image1;
        this.routeUrl = '/vendor-discussion';
        this.minDate = new Date()
        if (this._authTokenService.authToken !== '') {
            this.loggedInUserDetails = JSON.parse(this._authTokenService.loggedInUserData);
            this.setVendorDiscussion();
            this.getCategoty();
            //this.getVendor();
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
    setVendorDiscussion() {
        this.vendorDiscussionForm = this.formBuilder.group({
            DisussionTitle: ['', [Validators.required]],
            DateTime: ['', [Validators.required]],
            Category: ['', [Validators.required]],
            Description: [''],
            Vendor: ['', [Validators.required]]
        });
    }
    getCategoty() {
        this._commonService.getCategory()
            .subscribe(
            (results: any) => {
                this.categoryData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
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
    onCategory(category: any) {
        this._commonService.getVendorByCategory(category)
            .subscribe(
            (results: any) => {
                this.vendorData = results;
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
    onVendorDiscussion({ value, valid }: { value: VendorDiscussion, valid: boolean }) {
        debugger;
        if (valid) {
            this.errorFlagForAdd = false;
            value.CreatedBy = {
                'Name': this.loggedInUserDetails ? this.loggedInUserDetails.UserDetail.Name : '',
                'ID': this.loggedInUserDetails ? this.loggedInUserDetails.UserDetail.ID : '',
                'Title': this.loggedInUserDetails ? this.loggedInUserDetails.Title : ''
            };
            value.Route = this.routeUrl;
            let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
            if (isIEOrEdge) {
                this._spinnerService.show();
                this._dashboardService.AddVendorDisussionRequest(value)
                    .subscribe(
                    (results: any) => {
                        let id = results.Message.split('#')[1] ? results.Message.split('#')[1] : '';
                        let message = results.Message.split('#')[0] ? results.Message.split('#')[0] : 'Vendor discussion added successfully';
                        if (this.filesData.length > 0) {
                            value.ID = id;
                            this.disableSubmit = true;
                            for (let i = 0; i < this.filesData.length; i++) {
                                this._dashboardService.AddVDAttachmentForIE(value, this.filesData[i]).then(
                                    (results: any) => {
                                        if (i === this.filesData.length - 1) {
                                            this._spinnerService.hide();
                                            this._messageService.addMessage({
                                                severity: results === 'Attachment Added Successfully!' ? 'success' : 'error',
                                                summary: 'Success Message',
                                                detail: results === 'Attachment Added Successfully!' ? 'Vendor discussion added successfully' : results 
                                            });
                                            this.disableSubmit = false;
                                            this.fileName = '';
                                            this._router.navigate(['/vendor-discussion']);
                                        }
                                    },
                                    (error: any) => {
                                        this._spinnerService.hide();
                                        this.errorMessage = <any>error;
                                        this.disableSubmit = false;
                                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                                    });
                            }
                        } else {
                            this._spinnerService.hide();
                            this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: message });
                            this._router.navigate(['/vendor-discussion']);
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
                    this.disableSubmit = true;
                    this._spinnerService.show();
                    this._dashboardService.AddVendorDiscussionWithAtttachment(value, this.filesData).then(
                        (results: any) => {
                            this._spinnerService.hide();
                            this._messageService.addMessage({
                                severity: results === 'Vendor discussion added successfully' ? 'success' : 'error',
                                summary: 'Success Message',
                                detail: results
                            });
                            this.disableSubmit = false;
                            this.fileName = '';
                            this._router.navigate(['/vendor-discussion']);
                        },
                        (error: any) => {
                            this._spinnerService.hide();
                            this.errorMessage = <any>error;
                            this.disableSubmit = false;
                            this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                        });
                } else {
                    this._spinnerService.show();
                    this._dashboardService.AddVendorDisussionRequest(value)
                        .subscribe(
                        (results: any) => {
                            this._spinnerService.hide();
                            let id = results.Message.split('#')[1] ? results.Message.split('#')[1] : '';
                            let message = results.Message.split('#')[0] ? results.Message.split('#')[0] : 'Vendor discussion added successfully';
                            this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: message });
                            this._router.navigate(['/vendor-discussion']);
                        },
                        error => {
                            this._spinnerService.hide();
                            this.errorMessage = <any>error;
                            this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                        });
                }
            }
        } else {
            this.errorFlagForAdd = true;
        }
    }
}