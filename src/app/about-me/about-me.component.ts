import { Component, OnInit, NgModule, trigger, transition, style, animate, state } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { MessageService } from '../shared/services/message.service';
import { EmployeeInfo } from '../models/employeeInfo';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'app-aboutme',
    templateUrl: 'about-me.component.html',
    styleUrls: ['about-me.component.css'],
    providers: [ConfirmationService]
})
export class AboutComponent implements OnInit {
    /** List Varibales To Bind Data */
    employeeInfo: EmployeeInfo = new EmployeeInfo();
    userName: string;
    errorMessage: string;

    constructor(private formBuilder: FormBuilder, private _commonService: CommonService,
        private _messageService: MessageService,
        private _router: Router, private _confirmationService: ConfirmationService, ) {
    }
    ngOnInit() {
        // this.userName = 'k murali';
        if (sessionStorage.getItem('loggedInUserData')) {
            this.userName = JSON.parse(sessionStorage.getItem('loggedInUserData')).UserLookup.Name;
        } else {
            this.userName = '';
        }

        this.getMyData();
    }
    getMyData() {
        this._commonService.getMyData(this.userName)
            .subscribe(
            (results: any) => {
                if (results.length > 0) {
                    this.employeeInfo = results[0];
                }
            },
            error => {
                this.errorMessage = <any>error;
                this._router.navigate(['/unauthorized', 1]);
            });
    }
}
