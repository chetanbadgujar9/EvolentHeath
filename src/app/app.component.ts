import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { MessageService } from './shared/services/message.service';
import { Config } from './shared/config/config';
import { AuthTokenService } from './shared/services/authToken.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  hideAsideInBig: boolean;
  hideAsideInSmall: boolean;
  show: boolean = false;
  msgs: Message[] = [];
  hasAdminAccess: boolean = false;
  userRole: any = '';
  userFunction: any;
  loggedInUserName: string;
  currentURL: string;
  showRMS: boolean = true;
  rmsMenu: any = [];
  Image: any = '';
  Logo: any = '';
  showBtn: boolean = true;
  constructor(private router: Router, private _messageService: MessageService, private _authTokenService: AuthTokenService) { }
  ngOnInit() {
    this.Image = this._authTokenService.Image2;
    this.Logo = this._authTokenService.Logo;
    this.loggedInUserName = sessionStorage.getItem('UserTitle');
    this.currentURL = sessionStorage.getItem('currentURL');
    this._messageService.getMessages()
      .subscribe((value: Object) => {
        this.msgs = [];
        this.msgs.push(value);
      });
    this._messageService.getUserRole()
      .subscribe((value: any) => {
        this.userRole = value;
      });
    this._messageService.getUser()
      .subscribe((value: any) => {
        this.userFunction = value;
        if (this.userFunction.Role.indexOf('Vendor') >= 0) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
        }
      });
    this._messageService.getRMSMenu()
      .subscribe((value: any) => {
        this.rmsMenu = value;
        this.showRMS = false;
      });
    this._messageService.getAdminAccess()
      .subscribe((value: any) => {
        this.hasAdminAccess = value;
      });
  }
  check() {
    if (this.show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }
  checkRMSMenu() {
    if (this.showRMS) {
      this.showRMS = false;
    } else {
      this.showRMS = true;
    }
  }
  onAboutMe() {
    this.router.navigate(['/aboutMe']);
  }
  onSignInDiffUser() {
    this._authTokenService.authToken = '';
    this._authTokenService.loggedInUserData = '';
    this._authTokenService.loggedInUserName = '';
    this._authTokenService.loggedInUserRole = '';
    window.location.href = this.currentURL + '/_layouts/15/closeConnection.aspx?loginasanotheruser=true';
  }
  onSignOut() {
    this._authTokenService.authToken = '';
    this._authTokenService.loggedInUserData = '';
    this._authTokenService.loggedInUserName = '';
    this._authTokenService.loggedInUserRole = '';
    window.location.href = this.currentURL + '/_layouts/15/signout.aspx';
  }
  onLogoClick() {
    window.location.href = Config.getLogoURL();
  }
  onTitleClick() {
    this.router.navigate(['/']);
  }
  backToAhead() {
    window.location.href = 'http://ahead/';
  }
}
