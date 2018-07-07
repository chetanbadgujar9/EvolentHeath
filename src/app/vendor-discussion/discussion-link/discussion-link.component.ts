import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../../shared/services/common.service';
import { MessageService } from '../../shared/services/message.service';
import { DashboardService } from '../../services/dashboard.service';
import { slideInOutAnimation } from '../../animation/index';
import { AuthTokenService } from '../../shared/services/authToken.service';

/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-discussion-link',
    templateUrl: 'discussion-link.component.html',
    styleUrls: ['discussion-link.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' }
})
export class DiscussionLinkComponent implements OnInit {
    vendorCommunicationData: any;
    errorMessage: any;
    radioRequestType: any;
    show: boolean = false;
    // General Variables
    params: Params;
    currentUrl: any;
    type: any = '';
    vdID: any = '';
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
                this.vdID = this.params;
            });
        } else {
            this._router.navigate(['/vcs-dashboard']);
        }
    }
}
