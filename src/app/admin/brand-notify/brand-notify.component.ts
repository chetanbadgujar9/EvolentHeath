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
    selector: 'app-brand-notify',
    templateUrl: 'brand-notify.component.html',
    styleUrls: ['brand-notify.component.css'],
    providers: [ConfirmationService]
})
export class BrandNotifyComponent implements OnInit {
    BrandData: any[];
    userData: any[];
    errorMessage: string;
    showBrandForm: boolean = false;
    BrandForm: FormGroup;
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
            this.getBrand();
        } else {
            this._router.navigate(['/unauthorized', 1]);
        }
    }
    setForm() {
        this.BrandForm = this.formBuilder.group({
            Title: ['', [Validators.required]],
            System: ['', [Validators.required]],
            Notify1: ['', [Validators.required]],
            Notify2: [''],
            Notify3: [''],
            Notify4: [''],
            Notify5: [''],
            Notify6: [''],
            Notify7: [''],
            Notify8: [''],
            Notify9: [''],
        });
    }
    onAddRequest() {
        this.setForm();
        this.showBrandForm = true;
        this.errorFlag = false;
    }
    onCancel() {
        this.BrandForm.setValue({
            Title: '',
            System: '',
            Notify1: '',
            Notify2: '',
            Notify3: '',
            Notify4: '',
            Notify5: '',
            Notify6: '',
            Notify7: '',
            Notify8: '',
            Notify9: ''
        });
        this.showBrandForm = false;
    }
    getBrand() {
        this._commonService.getBrand()
            .subscribe(
            (results: any) => {
                this.BrandData = results;
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
    onEdit(location: any) {
        this.showBrandForm = true;
        this.Id = location.ID;
        this.BrandForm.setValue({
            Title: location.Title,
            System: location.System,
            Notify1: location.Notify1,
            Notify2: location.Notify2,
            Notify3: location.Notify3,
            Notify4: location.Notify4,
            Notify5: location.Notify5,
            Notify6: location.Notify6,
            Notify7: location.Notify7,
            Notify8: location.Notify8,
            Notify9: location.Notify9
        });
    }
    onDelete(location: any) {
        this._confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            accept: () => {
                this._commonService.deleteBrand(location)
                    .subscribe(
                    (results: any) => {
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getBrand();
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
        });

    }
    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        if (valid) {
            if (this.Id === '') {
                this._commonService.addBrand(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getBrand();
                        this.showBrandForm = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
            if (this.Id !== '') {
                value.ID = this.Id;
                value.Notify1 = value.Notify1.Name !== null ? value.Notify1 : null;
                value.Notify2 = value.Notify2.Name !== null ? value.Notify2 : null;
                value.Notify3 = value.Notify3.Name !== null ? value.Notify3 : null;
                value.Notify4 = value.Notify4.Name !== null ? value.Notify4 : null;
                value.Notify5 = value.Notify5.Name !== null ? value.Notify5 : null;

                value.Notify6 = value.Notify6.Name !== null ? value.Notify6 : null;
                value.Notify7 = value.Notify7.Name !== null ? value.Notify7 : null;
                value.Notify8 = value.Notify8.Name !== null ? value.Notify8 : null;
                value.Notify9 = value.Notify9.Name !== null ? value.Notify9 : null;
                this._commonService.updateBrand(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getBrand();
                        this.showBrandForm = false;
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
