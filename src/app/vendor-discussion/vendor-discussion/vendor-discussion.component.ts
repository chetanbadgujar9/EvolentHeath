import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthInfo } from '../../models/authInfo';
import { CommonService } from '../../shared/services/common.service';
import { MessageService } from '../../shared/services/message.service';
import { DashboardService } from '../../services/dashboard.service';
import { element } from 'protractor';
import { Replace } from '../../shared/config/replace';
import * as _ from 'lodash/index';
import { AuthTokenService } from '../../shared/services/authToken.service';
import { DiscussionDetailsComponent } from '../discussion-details/discussion-details.component';
/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-vendor-discussion',
    templateUrl: 'vendor-discussion.component.html',
    styleUrls: ['vendor-discussion.component.css'],
})
export class VendorDiscussionComponent implements OnInit, OnDestroy {
    _tempData: any[];
    vdID: any = '';
    details: any;
    errorMessage: any;
    userRole: any;
    username: any;
    params: Params;
    constructor(private _commonService: CommonService, private _messageService: MessageService,
        private _router: Router, private formBuilder: FormBuilder, private _dashboardService: DashboardService,
        private _authTokenService: AuthTokenService, private route: ActivatedRoute, ) {
        //
    }

    ngOnInit() {
        if (this._authTokenService.authToken !== '' && this._authTokenService.loggedInUserName !== '') {
            this.username = this._authTokenService.loggedInUserName;
            this.userRole = this._authTokenService.loggedInUserRole;
            this.route.params.forEach((params: Params) => {
                this.params = params['id'];
            });
            this.getVendorDiscussionData(this.username, this.userRole);
        } else {
            this._router.navigate(['/unauthorized', 1]);
        }
    }
    ngOnDestroy() {
        sessionStorage.removeItem('VCSID');
        sessionStorage.removeItem('Action');
    }
    getVendorDiscussionData(username: any, role: any) {
        this._dashboardService.getVendorDiscussion(username, role)
            .subscribe(
            (results: any) => {
                this._tempData = results;
                if (results.length > 0) {
                    if (this.params !== undefined && this.params !== null) {
                        this.vdID = this.params;
                    } else {
                        this.vdID = results ? results[0].Title : '';
                        this.details = results ? results[0] : [];
                    }
                }
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onViewRequest(request: any) {
        this._router.navigate(['/vendor-discussion/view-request', request.Title]);
    }
    onRowClick(dt) {
        this.vdID = '';
        this.vdID = dt.Title;
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}
