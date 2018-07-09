import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { ContactService } from '../../services/contact.service';
import { ConfirmationService } from 'primeng/primeng';
import * as _ from 'lodash/index';

@Component({
    moduleId: module.id,
    selector: 'app-contact-list',
    templateUrl: 'contact-list.component.html',
    styleUrls: ['contact-list.component.css'],
    providers: [ConfirmationService]
})
export class ContactListComponent implements OnInit, OnChanges {
    ContactList: any[];

    constructor(private _messageService: MessageService,
        private _router: Router, private _contactService: ContactService,
        private _confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.ContactList = [];
        this.getContactList();
    }
    ngOnChanges() {
        this.getContactList();
    }
    getContactList() {
        this.ContactList = this._contactService.getContactList();
        this.ContactList = this.ContactList.slice();
    }
    onUpdateRequest(request: any) {
        this._router.navigate(['/contact-list/update-contact', request.Id]);
    }
    onDeleteRequest(request: any) {
        this._confirmationService.confirm({
            message: 'Are you sure that you want to delete this contact ?',
            accept: () => {
                this._contactService.deleteContact(request.Id);
                this._messageService.addMessage({
                    severity: 'success', summary: 'Success Message', detail: 'Contact Deleted Successfully..!!'
                });
                this.getContactList();
            }
        });
    }
}
