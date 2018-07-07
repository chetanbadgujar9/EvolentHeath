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
    selector: 'app-vehicle-location',
    templateUrl: 'vehicle-location.component.html',
    styleUrls: ['vehicle-location.component.css'],
    providers: [ConfirmationService]
})
export class VehicleLocationComponent implements OnInit {
    vehicleLocationData: any[];
    errorMessage: string;
    showVehicleLocationForm: boolean = false;
    VehicleLocationForm: FormGroup;
    Id: any = '';
    errorFlag: boolean = false;
    constructor(private _messageService: MessageService,
        private _commonService: CommonService,
        private _confirmationService: ConfirmationService,
        private formBuilder: FormBuilder) {
    }
    ngOnInit() {
        this.setForm();
        this.getVehicleLocationList();
    }
    setForm() {
        this.VehicleLocationForm = this.formBuilder.group({
            Title: ['', [Validators.required]]
        });
    }
    onAddRequest() {
        this.setForm();
        this.showVehicleLocationForm = true;
        this.errorFlag = false;
    }
    onCancel() {
        this.VehicleLocationForm.setValue({
            Title: ''
        });
        this.showVehicleLocationForm = false;
    }
    getVehicleLocationList() {
        this._commonService.getVehicleLocation()
            .subscribe(
            (results: any) => {
                this.vehicleLocationData = results;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onEdit(location: any) {
        this.showVehicleLocationForm = true;
        this.Id = location.ID;
        this.VehicleLocationForm.setValue({
            Title: location.Title
        });
    }
    onDelete(location: any) {
        this._confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            accept: () => {
                this._commonService.deleteVehicleLocation(location)
                    .subscribe(
                    (results: any) => {
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getVehicleLocationList();
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
                this._commonService.addVehicleLocation(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getVehicleLocationList();
                        this.showVehicleLocationForm = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                        this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
                    });
            }
            if (this.Id !== '') {
                value.ID = this.Id;
                this._commonService.updateVehicleLocation(value)
                    .subscribe(
                    (results: any) => {
                        this.Id = '';
                        this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: results.Message });
                        this.getVehicleLocationList();
                        this.showVehicleLocationForm = false;
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
