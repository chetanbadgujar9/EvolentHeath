import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MessageService } from '../../shared/services/message.service';
import { ContactService } from '../../services/contact.service';
import { slideInOutAnimation } from '../../animation/index';

@Component({
    moduleId: module.id,
    selector: 'app-update-contact',
    templateUrl: 'update-contact.component.html',
    styleUrls: ['update-contact.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class UpdateContactComponent implements OnInit {
    contact: any;
    errorMessage: any;
    show: boolean;
    errorFlagForAdd: boolean;
    params: Params;
    /**Form Variables */
    UpdateContactForm: FormGroup;
    mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

    constructor(private _router: Router,
        private _messageService: MessageService,
        private _contactService: ContactService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder) {
    }
    ngOnInit() {
        this.show = false;
        this.errorFlagForAdd = false;
        this.setUpdateContactForm();
        this.route.params.forEach((params: Params) => {
            this.params = params['id'];
            this.getContactById(Number(this.params));
        });
    }
    setUpdateContactForm() {
        this.UpdateContactForm = this.formBuilder.group({
            FirstName: ['', [Validators.required]],
            LastName: ['', [Validators.required]],
            Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            PhoneNumber: ['', [Validators.required, Validators.pattern(this.mobnumPattern)]],
            Status: ['']
        });
    }
    getContactById(id) {
        this.contact = this._contactService.getContactById(id);
        this.UpdateContactForm.setValue({
            FirstName: this.contact.FirstName,
            LastName: this.contact.LastName,
            Email: this.contact.Email,
            PhoneNumber: this.contact.PhoneNumber,
            Status: this.contact.Status
        });
    }
    onBack() {
        this._router.navigate(['/contact-list']);
    }
    onUpdateContact({ value, valid }: { value: any, valid: boolean }) {
        if (valid) {
            this.errorFlagForAdd = false;
            value.Id = this.contact.Id;
            this._contactService.updateContact(value);
            this._messageService.addMessage({
                severity: 'success', summary: 'Success Message', detail: 'Contact Updated Successfully..!!'
            });
            this._router.navigate(['/contact-list']);
        } else {
            this.errorFlagForAdd = true;
        }
    }
}
