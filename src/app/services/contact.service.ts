/* angular dependencies */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';
import * as _ from 'lodash/index';

/** Third party dependencies */
import { SpinnerService } from '../shared/spinner/spinner.service';

@Injectable()
export class ContactService {
    http: Http;
    contactList: any = [{
        'Id': 1,
        'FirstName': 'Shane',
        'LastName': 'Watson',
        'Email': 'shane.watson@evolenthealth.com',
        'PhoneNumber': '9098909090',
        'Status': 'Active',
    }, {
        'Id': 2,
        'FirstName': 'Brandon',
        'LastName': 'Taylor',
        'Email': 'brandon.taylor@evolenthealth.com',
        'PhoneNumber': '9856453578',
        'Status': 'Active',
    }, {
        'Id': 3,
        'FirstName': 'Henry',
        'LastName': 'Jones',
        'Email': 'henry.jones@evolenthealth.com',
        'PhoneNumber': '9098909090',
        'Status': 'Inactive',
    }];

    constructor(http: Http,
        private _spinnerService: SpinnerService,
        private router: Router) {
        this.http = http;
    }
    getContactList() {
        return this.contactList;
    }
    addContact(payload: any) {
        payload.Id = this.contactList.length + 1;
        this.contactList.push(payload);
    }
    updateContact(payload: any) {
        let index = _.findIndex(this.contactList, { 'Id': payload.Id });
        this.contactList[index].FirstName = payload.FirstName;
        this.contactList[index].LastName = payload.LastName;
        this.contactList[index].Email = payload.Email;
        this.contactList[index].PhoneNumber = payload.PhoneNumber;
        this.contactList[index].Status = payload.Status;
    }
    getContactById(id) {
        let _tempContact = _.find(this.contactList, { 'Id': id });
        return _tempContact;
    }
    deleteContact(id) {
        let index = _.findIndex(this.contactList, { 'Id': id });
        this.contactList.splice(index, 1);
    }
}
