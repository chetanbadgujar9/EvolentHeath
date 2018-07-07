import { Component, OnInit, NgModule, trigger, transition, style, animate, state } from '@angular/core';
import { MessageService } from '../../shared/services/message.service';
import { CommonService } from '../../shared/services/common.service';
import { ConfirmationService } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'app-purpose-master',
    templateUrl: 'purpose-master.component.html',
    styleUrls: ['purpose-master.component.css'],
    providers: [ConfirmationService]
})
export class PurposeMasterComponent implements OnInit {
    purposeData: any[];
    errorMessage: string;
    showPurposeForm: boolean = false;
    PurposeForm: FormGroup;
    Id: any = '';
    errorFlag: boolean = false;
    title: any = '';
    constructor(private _messageService: MessageService,
        private _commonService: CommonService,
        private _confirmationService: ConfirmationService,
        private formBuilder: FormBuilder) {
    }
    ngOnInit() {
        this.setForm();
        this.getpurposeList();
    }
    setForm() {
        this.PurposeForm = this.formBuilder.group({
            Title: ['', [Validators.required]],
            PurposeDescription: ['', [Validators.required]],
        });
    }
    onAddRequest() {
        this.setForm();
        this.showPurposeForm = true;
        this.errorFlag = false;
        this.title = '';
    }
    onCancel() {
        this.PurposeForm.setValue({
            Title: '',
            PurposeDescription: ''
        });
        this.showPurposeForm = false;
    }
    getpurposeList() {
        this._commonService.getPurposeMaster()
            .subscribe(
            (results: any) => {
                this.purposeData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onEdit(location: any) {
        this.showPurposeForm = true;
        this.Id = location.ID;
        this.title = location.Title;
        this.PurposeForm.setValue({
            Title: location.Title,
            PurposeDescription: location.PurposeDescription
        });
    }
    onDelete(location: any) {
        this._confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            accept: () => {
                this._commonService.deletePurpose(location)
                    .subscribe(
                    (results: any) => {
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getpurposeList();
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
            value.PurposeCode = value.Title;
            if (this.Id === '') {
                this._commonService.addPurpose(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getpurposeList();
                        this.showPurposeForm = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
            if (this.Id !== '') {
                value.ID = this.Id;
                this._commonService.updatePurpose(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getpurposeList();
                        this.showPurposeForm = false;
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
    toUppercaseString(title: string) {
        this.title = title.toUpperCase();
    }
}
