import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MessageService {

    onMessageAdd: EventEmitter<Object> = new EventEmitter<Object>();
    showDashboardFlag = new EventEmitter();
    userRole = new EventEmitter();
    adminAccess = new EventEmitter();
    RMSMenu = new EventEmitter();
    userFunction = new EventEmitter();
    getMessages() {
        return this.onMessageAdd;
    }
    addMessage(value: Object) {
        this.onMessageAdd.emit(value);
    }

    getDashboardFlag() {
        return this.showDashboardFlag;
    }
    AddDashboardFlag(value: boolean) {
        this.showDashboardFlag.emit(value);
    }
    getUserRole() {
        return this.userRole;
    }
    AddUserRole(value: any) {
        this.userRole.emit(value);
    }
    getUser() {
        return this.userFunction;
    }
    AddUser(value: any) {
        this.userFunction.emit(value);
    }
    getAdminAccess() {
        return this.adminAccess;
    }
    AddAdminAccess(value: any) {
        this.adminAccess.emit(value);
    }
    getRMSMenu() {
        return this.RMSMenu;
    }
    AddRMSMenu(value: any) {
        this.RMSMenu.emit(value);
    }
}