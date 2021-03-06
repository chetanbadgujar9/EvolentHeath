// Angular Dependencies
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Third party dependencies
import { slideInOutAnimation } from '../../animation/index';
import { MessageService } from '../../shared/services/message.service';
import { ContactList } from '../../models/contact-model';
import { ContactService } from '../../services/contact.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'add-contact.component.html',
    styleUrls: ['add-contact.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})

export class AddContactComponent implements OnInit {
    loggedInUserDetails: any;
    errorMessage: any;
    errorFlagForAdd: boolean;
    /**Form Variables */
    AddContactForm: FormGroup;

    mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

    constructor(
        private _router: Router,
        private _messageService: MessageService,
        private formBuilder: FormBuilder,
        private _contactService: ContactService,
        private _spinnerService: SpinnerService) {
    }

    ngOnInit() {
        this.errorFlagForAdd = false;
        this.setAddContactForm();
    }
    setAddContactForm() {
        this.AddContactForm = this.formBuilder.group({
            FirstName: ['', [Validators.required]],
            LastName: ['', [Validators.required]],
            Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(this.mobnumPattern)]],
            Status: ['Active']
        });
    }

    onAddContact({ value, valid }: { value: ContactList, valid: boolean }) {
        if (valid) {
            this.errorFlagForAdd = false;
            this._contactService.addContact(value);
            this._messageService.addMessage({ severity: 'success', summary: 'Success Message', detail: 'Contact Added Successfully..!!' });
            this._router.navigate(['/contact-list']);
        } else {
            this.errorFlagForAdd = true;
        }
    }
}
