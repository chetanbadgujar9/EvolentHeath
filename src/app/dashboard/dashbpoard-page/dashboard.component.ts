import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthInfo } from '../../models/authInfo';
import { User } from '../../models/loginUser';
import { CommonService } from '../../shared/services/common.service';
import { MessageService } from '../../shared/services/message.service';
import { ConfirmationService } from 'primeng/primeng';
import { AuthTokenService } from '../../shared/services/authToken.service';
/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css'],
    providers: [ConfirmationService]
})
export class DashboardComponent implements OnInit {
    rmsMenu: any[];
    /** Model Variable */
    model: AuthInfo;
    loggedInUserData: User = new User();

    // General User
    loggedInUser: string;
    loginName: string;
    loggedInUserRole: string;
    errorMessage: string;
    Image1: any = '';
    Image2: any = '';
    Image3: any = '';

    vcsId: string;
    action: string;

    constructor(private _router: Router, private _commonService: CommonService, private _messageService: MessageService,
        private _authTokenService: AuthTokenService) {
        this.model = new AuthInfo('password', '', '');
    }

    ngOnInit() {
        this.Image1 = this._authTokenService.Image1;
        this.Image2 = this._authTokenService.Image2;
        this.Image3 = this._authTokenService.Image3;

        this.loggedInUser = 'TCCTEST7';
        this.loginName = 'TCCTEST7';

        // this.loginName = sessionStorage.getItem('Username') ? sessionStorage.getItem('Username').split('\\')[1] : '';
        // this.loggedInUser = sessionStorage.getItem('UserTitle') ? sessionStorage.getItem('UserTitle') : '';

        if (this._authTokenService.authToken === '') {
            this.getAuthToken();
        } else {
            //this.getRMSMenus();
            //this.getAdminAccess(this.loginName);
            if (this._authTokenService.loggedInUserData !== undefined) {
                this.loggedInUserData = JSON.parse(this._authTokenService.loggedInUserData);
                this._messageService.AddUser(this.loggedInUserData);
                if (this.loggedInUserData.Role.indexOf('Vendor') >= 0) {
                    this.roleWiseDashboards();
                } else {
                    this.getGLMapping();
                }
                //this.roleWiseDashboards();
            } else {
                this._router.navigate(['/unauthorized', 1]);
            }
        }
    }
    /** Entry Point */
    getAuthToken() {
        this.model.UserName = this.loginName;
        this.model.Password = '';
        this._commonService.getAuthToken(this.model)
            .subscribe(
            (results: any) => {
                //this.getRMSMenus();
                //this.getAdminAccess(this.loginName);
                this.getLoggedInUserDetails();
            },
            error => {
                this.errorMessage = <any>error;
                this._router.navigate(['/unauthorized', 1]);
            });
    }

    getLoggedInUserDetails() {
        this._commonService.getLoggedInUserDetails(this.loggedInUser ? this.loggedInUser : '')
            .subscribe(
            (results: any) => {
                if (Object.keys(results).length !== 0) {
                    this.loggedInUserData = results;
                    this.loggedInUserRole = results.Role;
                    this._messageService.AddUser(results);
                    this._authTokenService.loggedInUserName = results.Title;
                    this._authTokenService.loggedInUserData = JSON.stringify(results);
                    if (this.loggedInUserData.Role.indexOf('Vendor') >= 0) {
                        this.roleWiseDashboards();
                    } else {
                        this.getGLMapping();
                    }
                    //this.roleWiseDashboards();
                } else {
                    this._router.navigate(['/unauthorized', 1]);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    getGLMapping() {
        this._commonService.getGLMapping(this.loggedInUser ? this.loggedInUser : '')
            .subscribe(
            (results: any) => {
                if (Object.keys(results).length !== 0) {
                    this.roleWiseDashboards();
                } else {
                    this._router.navigate(['/unauthorized', 2]);
                }
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }
    roleWiseDashboards() {
        this.vcsId = sessionStorage.getItem('VCSID') ? sessionStorage.getItem('VCSID') : '';
        this.action = sessionStorage.getItem('Action') ? sessionStorage.getItem('Action') : '';

        if (this.loggedInUserData.Role.indexOf('Users') >= 0) {
            this._messageService.AddUserRole('Users');
            this._authTokenService.loggedInUserRole = 'designer';
            if (this.vcsId !== '' && (this.action === '/vendor-communication/requester-need-info' || this.action === '/vendor-communication/requester-request-close' || this.action === '/vendor-communication/requester-request-signoff' || this.action === '/vendor-discussion')) {
                this._router.navigate([this.action, this.vcsId]);
            } else if (this.vcsId !== '') {
                this._router.navigate(['/vendor-communication/view-request', this.vcsId]);
            } else {
                this._router.navigate(['/vendor-communication']);
            }
        } else if (this.loggedInUserData.Role.indexOf('GL') >= 0) {
            this._messageService.AddUserRole('GL');
            this._authTokenService.loggedInUserRole = 'gl';
            if (this.vcsId !== '' && (this.action === '/vendor-communication/gl-approval' || this.action === '/vendor-communication/gl-request-close' || this.action === '/vendor-discussion')) {
                this._router.navigate([this.action, this.vcsId]);
            } else if (this.vcsId !== '') {
                this._router.navigate(['/vendor-communication/view-request', this.vcsId]);
            } else {
                this._router.navigate(['/vendor-communication']);
            }
        } else if (this.loggedInUserData.Role.indexOf('CD') >= 0) {
            this._messageService.AddUserRole('CD');
            this._authTokenService.loggedInUserRole = 'cd';
            if (this.vcsId !== '' && (this.action === '/vendor-communication/cd-approval' || this.action === '/vendor-communication/cd-clouser' || this.action === '/vendor-discussion')) {
                this._router.navigate([this.action, this.vcsId]);
            }else if (this.vcsId !== '') {
                this._router.navigate(['/vendor-communication/view-request', this.vcsId]);
            } else {
                this._router.navigate(['/vendor-communication']);
            }
        } else if (this.loggedInUserData.Role.indexOf('Vendor') >= 0) {
            this._messageService.AddUserRole('Vendor');
            this._authTokenService.loggedInUserRole = 'vendor';
            if (this.vcsId !== '' && (this.action === '/vendor-communication/vendor-need-info' || this.action === '/vendor-communication/vendor-request-clouser' || this.action === '/vendor-discussion')) {
                this._router.navigate([this.action, this.vcsId]);
            }else if (this.vcsId !== '') {
                this._router.navigate(['/vendor-communication/view-request', this.vcsId]);
            } else {
                this._router.navigate(['/vcs-dashboard']);
            }
        } else {
            this._router.navigate(['/unauthorized', 1]);
        }
    }

    getRMSMenus() {
        this._commonService.getRMSMenus()
            .subscribe(
            (results: any) => {
                this.rmsMenu = results;
                this._messageService.AddRMSMenu(this.rmsMenu);
            },
            error => {
                this.errorMessage = <any>error;
                this._messageService.addMessage({ severity: 'error', summary: 'Error Message', detail: this.errorMessage });
            });
    }

    getAdminAccess(username: any) {
        this._commonService.getAdminAccess(username)
            .subscribe((results: any) => {
                if (Object.keys(results).length !== 0) {
                    this._messageService.AddAdminAccess(true);
                }
            });
    }
}
