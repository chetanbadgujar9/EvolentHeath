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
    selector: 'app-plant-info-list',
    templateUrl: 'plant-info-list.component.html',
    styleUrls: ['plant-info-list.component.css'],
    providers: [ConfirmationService]
})
export class PlantInfoListComponent implements OnInit {
    plantData: any[];
    errorMessage: string;
    showPlantForm: boolean = false;
    PlantForm: FormGroup;
    Id: any = '';
    errorFlag: boolean = false;
    constructor(private _messageService: MessageService,
        private _commonService: CommonService,
        private _confirmationService: ConfirmationService,
        private formBuilder: FormBuilder) {
    }
    ngOnInit() {
        this.setForm();
        this.getPlantList();
    }
    setForm() {
        this.PlantForm = this.formBuilder.group({
            PlantName: ['', [Validators.required]],
            Emails: ['', [Validators.required]],
        });
    }
    onAddRequest() {
        this.setForm();
        this.showPlantForm = true;
        this.errorFlag = false;
    }
    onCancel() {
        this.PlantForm.setValue({
            PlantName: '',
            Emails: ''
        });
        this.showPlantForm = false;
    }
    getPlantList() {
        this._commonService.getVMSPlantMaster()
            .subscribe(
            (results: any) => {
                this.plantData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onEdit(location: any) {
        this.showPlantForm = true;
        this.Id = location.ID;
        this.PlantForm.setValue({
            PlantName: location.PlantName,
            Emails: location.Emails
        });
    }
    onDelete(location: any) {
        this._confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            accept: () => {
                this._commonService.deleteVMSPlantMaster(location)
                    .subscribe(
                    (results: any) => {
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getPlantList();
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
                this._commonService.addVMSPlantMaster(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getPlantList();
                        this.showPlantForm = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
            if (this.Id !== '') {
                value.ID = this.Id;
                this._commonService.updateVMSPlantMaster(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getPlantList();
                        this.showPlantForm = false;
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
