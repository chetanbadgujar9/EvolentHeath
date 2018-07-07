import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../../../shared/services/common.service';
import { MessageService } from '../../../shared/services/message.service';
import { DashboardService } from '../../../services/dashboard.service';
import { slideInOutAnimation } from '../../../animation/index';
import { AuthTokenService } from '../../../shared/services/authToken.service';

/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-vendor-request-clouser',
    templateUrl: 'vendor-request-clouser.component.html',
    styleUrls: ['vendor-request-clouser.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class VendorRequestClouserComponent implements OnInit {
    vmsData: any;
    errorMessage: any;
    radioRequestType: any;
    show: boolean = false;
    // General Variables
    params: Params;
    currentUrl: any;
    type: any = '';
    constructor(private _router: Router,
        private _commonService: CommonService,
        private _messageService: MessageService,
        private _dashboardService: DashboardService,
        private route: ActivatedRoute,
        private _authTokenService: AuthTokenService) {

    }
    ngOnInit() {
        if (this._authTokenService.authToken !== '') {
            this.route.params.forEach((params: Params) => {
                this.params = params['id'];
                this.getVendorCommunicationByID(this.params);
            });
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
    getVendorCommunicationByID(id: any) {
        this._dashboardService.getVendorCommunicationByID(id)
            .subscribe(
            (results: any) => {
                this.vmsData = results;
                this.show = true;
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    onBack() {
        this.currentUrl = this._router.url ? this._router.url : '';
        if (this.currentUrl.toString().toLowerCase().indexOf('vendor-communication') >= 0) {
            this._router.navigate(['/vendor-communication']);
        } else {
            this._router.navigate(['/vendor-discussion']);
        }
    }
}
