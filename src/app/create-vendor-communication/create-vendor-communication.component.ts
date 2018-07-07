import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { slideInOutAnimation } from '../animation/index';
import { AuthTokenService } from '../shared/services/authToken.service';
import { CommonService } from '../shared/services/common.service';
import { MessageService } from '../shared/services/message.service';
import { VendorCommunication } from '../models/vendor-communication';
import { DashboardService } from '../services/dashboard.service';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'create-vendor-communication.component.html',
    styleUrls: ['create-vendor-communication.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})

export class CreateVendorCommunicationComponent implements OnInit {
    title = "Add Product";
    product: any = {};
    brandData: any[];
    projectData: any[];
    categoryData: any[];
    systemData: any[];
    requirementData: any[];
    vendorData: any[];
    loggedInUserDetails: any;

    errorMessage: any;
    errorFlagForAdd: boolean = false;
    fileError: boolean = false;

    filesData: any;
    attachmentURL: any = {};
    fileName: string = '';
    disableSubmit: boolean = false;
    bgImage: any = '';
    partErr: boolean = false;
    /**Form Variables */
    vendorCommunicationForm: FormGroup;
    routeUrl: any = '';
    showValidate: boolean = true;
    itemID: any = '';
    revID: any = '';
    revErr: boolean = false;
    itemErr: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private _router: Router,
        private _authTokenService: AuthTokenService,
        private _commonService: CommonService,
        private _messageService: MessageService,
        private formBuilder: FormBuilder,
        private _dashboardService: DashboardService,
        private _spinnerService: SpinnerService, ) {
        this.filesData = new Array<File>();
    }

    ngOnInit() {
        this.bgImage = this._authTokenService.Image2;
        this.routeUrl = '/vendor-communication/gl-approval';
        if (this._authTokenService.authToken !== '') {
            this.loggedInUserDetails = JSON.parse(this._authTokenService.loggedInUserData);
            this.setVendorCommunication();
            this.getBrand();
            this.getCategoty();
            this.getSystem();
            this.getRequirement();
            //this.getVendor();
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
    setVendorCommunication() {
        this.vendorCommunicationForm = this.formBuilder.group({
            ItemID: ['', [Validators.required]],
            RevID: ['', [Validators.required]],
            ItemDescription: ['', [Validators.required]],
            Project: ['', [Validators.required]],
            Brand: ['', [Validators.required]],
            System: ['', [Validators.required]],
            Category: ['', [Validators.required]],
            Requirement: ['', [Validators.required]],
            DescriptionOnData: ['', [Validators.required]],
            Vendor: ['']
        });
    }
    getBrand() {
        this._commonService.getBrandMaster()
            .subscribe(
            (results: any) => {
                this.brandData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
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
    getSystem() {
        this._commonService.getSystem()
            .subscribe(
            (results: any) => {
                this.systemData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getRequirement() {
        this._commonService.getRequirement()
            .subscribe(
            (results: any) => {
                this.requirementData = results;
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
    onBrand(brand) {
        this._commonService.getProjectByBrand(brand)
            .subscribe(
            (results: any) => {
                this.projectData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onCategory(category) {
        if (category !== '' && this.vendorCommunicationForm.controls['Requirement'].value !== 'New Developement' && this.vendorCommunicationForm.controls['Requirement'].value !== '') {
            this.vendorData = [];
            this.vendorCommunicationForm.controls['Vendor'].enable({ onlySelf: true });
            this.vendorCommunicationForm.controls['Vendor'].setValidators(Validators.required);
            this.vendorCommunicationForm.controls['Vendor'].updateValueAndValidity();
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
        else {
            this.vendorCommunicationForm.controls['Vendor'].disable({ onlySelf: true });
            this.vendorCommunicationForm.controls['Vendor'].clearValidators();
            this.vendorCommunicationForm.controls['Vendor'].updateValueAndValidity();
        }
    }
    onRequirement(req) {
        if (req === 'New Developement') {
            this.vendorCommunicationForm.controls['Vendor'].disable({ onlySelf: true });
            this.vendorCommunicationForm.controls['Vendor'].setValue('');
            this.vendorCommunicationForm.controls['Vendor'].clearValidators();
            this.vendorCommunicationForm.controls['Vendor'].updateValueAndValidity();
        }
        else if (req !== 'New Developement' && this.vendorCommunicationForm.controls['Category'].value !== '') {
            this.vendorCommunicationForm.controls['Vendor'].enable({ onlySelf: true });
            this.vendorCommunicationForm.controls['Vendor'].setValidators(Validators.required);
            this.vendorCommunicationForm.controls['Vendor'].updateValueAndValidity();
            this.vendorData = [];
            this._commonService.getVendorByCategory(this.vendorCommunicationForm.controls['Category'].value)
                .subscribe(
                (results: any) => {
                    this.vendorData = results;
                },
                error => {
                    this.errorMessage = <any>error;
                    this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                });
        } else {

        }
    }
    validateItemID() {
        if (this.vendorCommunicationForm.controls['ItemID'].value !== '' && this.vendorCommunicationForm.controls['RevID'].value !== '') {
            this.revErr = false;;
            this.itemErr = false;
            this._commonService.validatePartNo(this.vendorCommunicationForm.controls['ItemID'].value, this.vendorCommunicationForm.controls['RevID'].value)
                .subscribe(
                (results: any) => {
                    if (Object.keys(results).length > 0) {
                        this.partErr = false;
                        this.vendorCommunicationForm.controls['ItemDescription'].setValue(results);
                        this.vendorCommunicationForm.controls['ItemID'].disable({ onlySelf: true });
                        this.vendorCommunicationForm.controls['RevID'].disable({ onlySelf: true });
                        this.itemID = this.vendorCommunicationForm.controls['ItemID'].value.toUpperCase();
                        this.revID = this.vendorCommunicationForm.controls['RevID'].value.toUpperCase();
                        this.showValidate = false;
                    } else {
                        this.vendorCommunicationForm.controls['ItemDescription'].setValue('');
                        this.vendorCommunicationForm.controls['ItemID'].enable({ onlySelf: true });
                        this.vendorCommunicationForm.controls['RevID'].enable({ onlySelf: true });
                        this.itemID = '';
                        this.revID = '';
                        this.partErr = true;
                    }
                },
                error => {
                    this.errorMessage = <any>error;
                    this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                });
        } else if (this.vendorCommunicationForm.controls['ItemID'].value === '' && this.vendorCommunicationForm.controls['RevID'].value === '' && !this.errorFlagForAdd) {
            this.revErr = true;
            this.itemErr = true;
        } else if (this.vendorCommunicationForm.controls['ItemID'].value === '' && !this.errorFlagForAdd) {
            this.revErr = false;;
            this.itemErr = true;
        } else if (this.vendorCommunicationForm.controls['RevID'].value === '' && !this.errorFlagForAdd) {
            this.revErr = true;;
            this.itemErr = false;
        } else { }
    }
    changeID() {
        this.showValidate = true;
        this.vendorCommunicationForm.controls['ItemDescription'].setValue('');
        this.vendorCommunicationForm.controls['ItemID'].setValue('');
        this.vendorCommunicationForm.controls['RevID'].setValue('');
        this.vendorCommunicationForm.controls['ItemID'].enable({ onlySelf: true });
        this.vendorCommunicationForm.controls['RevID'].enable({ onlySelf: true });
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
    onVendorCommunication({ value, valid }: { value: VendorCommunication, valid: boolean }) {
        debugger;
        if (valid) {
            this.errorFlagForAdd = false;
            value.ItemID = this.itemID + '/' + this.revID;
            value.CreatedBy = {
                'Name': this.loggedInUserDetails ? this.loggedInUserDetails.UserDetail.Name : '',
                'ID': this.loggedInUserDetails ? this.loggedInUserDetails.UserDetail.ID : '',
                'Title': this.loggedInUserDetails ? this.loggedInUserDetails.Title : ''
            };
            value.Route = this.routeUrl;
            let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
            if (isIEOrEdge) {
                this._spinnerService.show();
                this._dashboardService.AddVendorCommunicationRequest(value)
                    .subscribe(
                    (results: any) => {
                        let id = results.Message.split('#')[1] ? results.Message.split('#')[1] : '';
                        let message = results.Message.split('#')[0] ? results.Message.split('#')[0] : 'Vendor communication added successfully';
                        if (this.filesData.length > 0) {
                            value.ID = id;
                            this.disableSubmit = true;
                            for (let i = 0; i < this.filesData.length; i++) {
                                this._dashboardService.AddVCAttachmentForIE(value, this.filesData[i]).then(
                                    (results: any) => {
                                        if (i === this.filesData.length - 1) {
                                            this._spinnerService.hide();
                                            this._messageService.addMessage({
                                                severity: results === 'Attachment Added Successfully!' ? 'success' : 'error',
                                                summary: 'Success Message',
                                                detail: results === 'Attachment Added Successfully!' ? 'Vendor communication added successfully' : results
                                            });
                                            this.disableSubmit = false;
                                            this.fileName = '';
                                            this._router.navigate(['/vendor-communication']);
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
                            this._router.navigate(['/vendor-communication']);
                        }
                    },
                    error => {
                        this._spinnerService.hide();
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });

            } else {
                if (this.filesData.length > 0) {
                    this.disableSubmit = true;
                    this._spinnerService.show();
                    this._dashboardService.AddVendorCommunicationWithAtttachment(value, this.filesData).then(
                        (results: any) => {
                            this._spinnerService.hide();
                            this._messageService.addMessage({
                                severity: results === 'Vendor communication added successfully' ? 'success' : 'error',
                                summary: 'Success Message',
                                detail: results
                            });
                            this.disableSubmit = false;
                            this.fileName = '';
                            this._router.navigate(['/vendor-communication']);
                        },
                        (error: any) => {
                            this._spinnerService.hide();
                            this.errorMessage = <any>error;
                            this.disableSubmit = false;
                            this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                        });
                } else {
                    this._spinnerService.show();
                    this._dashboardService.AddVendorCommunicationRequest(value)
                        .subscribe(
                        (results: any) => {
                            this._spinnerService.hide();
                            let id = results.Message.split('#')[1] ? results.Message.split('#')[1] : '';
                            let message = results.Message.split('#')[0] ? results.Message.split('#')[0] : 'Vendor communication added successfully';
                            this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: message });
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
            this.errorFlagForAdd = true;
            this.revErr = false;
            this.itemErr = false;
        }
    }
}