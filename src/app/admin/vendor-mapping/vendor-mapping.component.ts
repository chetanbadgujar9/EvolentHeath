import { Component, OnInit, NgModule, trigger, transition, style, animate, state } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { CommonService } from '../../shared/services/common.service';
import { ConfirmationService } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { AuthTokenService } from '../../shared/services/authToken.service';
import { VendorMapping } from '../../models/vendor-mapping';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'app-vendor-mapping',
    templateUrl: 'vendor-mapping.component.html',
    styleUrls: ['vendor-mapping.component.css'],
    providers: [ConfirmationService]
})
export class VendorMappingComponent implements OnInit {
    VendorMappingData: any[];
    userData: any[];
    errorMessage: string;
    showVendorMappingForm: boolean = false;
    VendorMappingForm: FormGroup;
    Id: any = '';
    errorFlag: boolean = false;
    constructor(private _messageService: MessageService,
        private _commonService: CommonService,
        private _confirmationService: ConfirmationService,
        private formBuilder: FormBuilder,
        private _authTokenService: AuthTokenService,
        private _router: Router) {
    }
    ngOnInit() {
        if (this._authTokenService.authToken !== '' && this._authTokenService.loggedInUserName !== '') {
            this.setForm();
            this.getVendorMapping();
        } else {
            this._router.navigate(['/unauthorized', 1]);
        }
    }
    setForm() {
        this.VendorMappingForm = this.formBuilder.group({
            Title: ['', [Validators.required]],
            VendorName: [''],
            Category: [''],
            CDName: [''],
            cd1: [''],
            cd2: [''],
            cd3: [''],
            cd4: [''],
            Vendor_CP1: [''],
            Vendor_CP2: [''],
            Vendor_CP3: [''],
            Vendor_CP4: [''],
            Vendor_CP5: ['']
        });
    }
    onAddRequest() {
        this.setForm();
        this.showVendorMappingForm = true;
        this.errorFlag = false;
    }
    onCancel() {
        this.VendorMappingForm.setValue({
            Title: '',
            VendorName: '',
            Category: '',
            CDName: '',
            cd1: '',
            cd2: '',
            cd3: '',
            cd4: '',
            Vendor_CP1: '',
            Vendor_CP2: '',
            Vendor_CP3: '',
            Vendor_CP4: '',
            Vendor_CP5: ''
        });
        this.showVendorMappingForm = false;
    }
    getVendorMapping() {
        this._commonService.getVendorMapping()
            .subscribe(
            (results: any) => {
                this.VendorMappingData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getAssignToUsers(event: any) {
        let query = event.query;
        this._commonService.getAssignToUsers(query)
            .subscribe(
            (results: any) => {
                this.userData = results;
                // this.assignToUsers =[ {'ID':1,'name':'Amol'},{'ID':2,'name':'Amul'}];
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onEdit(location: VendorMapping) {
        this.showVendorMappingForm = true;
        this.Id = location.ID;
        this.VendorMappingForm.setValue({
            Title: location.Title,
            VendorName: location.VendorName,
            Category: location.Category,
            CDName: location.CDName,
            cd1: location.cd1,
            cd2: location.cd2,
            cd3: location.cd3,
            cd4: location.cd4,
            Vendor_CP1: location.Vendor_CP1,
            Vendor_CP2: location.Vendor_CP2,
            Vendor_CP3: location.Vendor_CP3,
            Vendor_CP4: location.Vendor_CP4,
            Vendor_CP5: location.Vendor_CP5
        });
    }
    onDelete(location: any) {
        this._confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            accept: () => {
                this._commonService.deleteVendorMapping(location)
                    .subscribe(
                    (results: any) => {
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getVendorMapping();
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
        });

    }
    onSubmit({ value, valid }: { value: VendorMapping, valid: boolean }) {
        if (valid) {
            if (this.Id === '') {
                this._commonService.addVendorMapping(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getVendorMapping();
                        this.showVendorMappingForm = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
            if (this.Id !== '') {
                value.ID = this.Id;
                value.CDName = value.CDName.Name !== null ? value.CDName : null;
                value.cd1 = value.cd1.Name !== null ? value.cd1 : null;
                value.cd2 = value.cd2.Name !== null ? value.cd2 : null;
                value.cd3 = value.cd3.Name !== null ? value.cd3 : null;
                value.cd4 = value.cd4.Name !== null ? value.cd4 : null;

                value.Vendor_CP1 = value.Vendor_CP1.Name !== null ? value.Vendor_CP1 : null;
                value.Vendor_CP2 = value.Vendor_CP2.Name !== null ? value.Vendor_CP2 : null;
                value.Vendor_CP3 = value.Vendor_CP3.Name !== null ? value.Vendor_CP3 : null;
                value.Vendor_CP4 = value.Vendor_CP4.Name !== null ? value.Vendor_CP4 : null;
                this._commonService.updateVendorMapping(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getVendorMapping();
                        this.showVendorMappingForm = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }

        } else {
            this.errorFlag = true;
        }

    }
}
