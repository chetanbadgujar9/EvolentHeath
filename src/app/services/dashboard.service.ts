/* angular dependencies */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';

/** Third party dependencies */
import { SpinnerService } from '../shared/spinner/spinner.service';
import { Config } from '../shared/config/config';
import { AuthHttp } from '../shared/services/authHttp.service';
import { AuthTokenService } from '../shared/services/authToken.service';

@Injectable()
export class DashboardService {
    http: Http;


    constructor(http: Http,
        private authHttp: AuthHttp,
        private _spinnerService: SpinnerService,
        private router: Router,
        private _authTokenService: AuthTokenService) {
        this.http = http
    }

    getShift() {
        const url = Config.GetURL('/api/holidayWorking/ShiftMaster/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addShift(payload: any) {
        const url = Config.GetURL('/api/holidayWorking/ShiftMaster/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateShift(payload: any) {
        const url = Config.GetURL('/api/testrequest/ShiftMaster/UpdateShiftMasterByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deconsteShift(value: any) {
        const url = Config.GetURL('/api/holidayWorking/ShiftMaster/DeconsteEquipmentMasterByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVMSDataByVMSID(id: any) {
        const url = Config.GetURL('/api/VMS/BALVMSCoreMasterList/BALVMSCoreMasterListByVMSID?vmsID=' + id);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorCommunicationByID(id: any) {
        const url = Config.GetURL('/api/VC/GetByVCID/' + id);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorDiscussionByID(id: any) {
        const url = Config.GetURL('/api/VendorDiscussion/GetByVDId/' + id);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getDiscusssionBoardById(id: any) {
        const url = Config.GetURL('/api/DiscussionBoard/GetDiscussionBoard?VC_VD_ID=' + id);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVMSDataByStatusAndVMSID(id: any, status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSCoreMasterList/BALVMSByVMSIDAndStatus?vmsID=' + id + '&status=' + status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getAllData() {
        const url = Config.GetURL('/api/VMS/BALVMSCoreMasterList/GetAllVMSRequests');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getRequesterStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusRequester?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getGLStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusGL?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getL1StatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusL1?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getStoresStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatus?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getCTOStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusCTO?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getCFOStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusCFO?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getPurchaseStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusPurchase?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getTCStatusWiseData(Status: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/GetBALVMSTransactionListByStatusTC?status=' + Status);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    AddVendorCommunicationRequest(payload: any) {
        const url = Config.GetURL('/api/VC/Post');
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => '');
    }
    AddVendorDisussionRequest(payload: any) {
        const url = Config.GetURL('/api/VendorDiscussion/Post');
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => '');
    }
    AddVCAttachmentForIE(payload: any, resumeMeta: any) {
        const url = Config.GetURL('/api/VC/AddVCAttachment');
        //this._spinnerService.show();
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            let data = { 'File': payload };
            formData.append(JSON.stringify(payload), 'Data');
            formData.append('file', resumeMeta);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            // xhr.setRequestHeader('Content-Type', undefined);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this._authTokenService.authToken);
            xhr.send(formData);
            //this._spinnerService.hide();
        });
    }
    AddVDAttachmentForIE(payload: any, resumeMeta: any) {
        const url = Config.GetURL('/api/VendorDiscussion/AddVDAttachment');
        //this._spinnerService.show();
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            let data = { 'File': payload };
            formData.append(JSON.stringify(payload), 'Data');
            formData.append('file', resumeMeta);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            // xhr.setRequestHeader('Content-Type', undefined);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this._authTokenService.authToken);
            xhr.send(formData);
            //this._spinnerService.hide();
        });
    }
    AddVendorCommunicationWithAtttachment(payload: any, resumeMeta: any) {
        const url = Config.GetURL('/api/VC/AddVCWithMultipleAttachment');
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            let data = { 'File': payload };
            formData.append(JSON.stringify(payload), 'Data');
            resumeMeta.forEach(element => {
                formData.append('file', element);
            });
            //formData.append('file', resumeMeta[0]);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            // xhr.setRequestHeader('Content-Type', undefined);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this._authTokenService.authToken);
            xhr.send(formData);
        });
    }
    updateVendorCommunicationWithAtttachment(payload: any, resumeMeta: any) {
        const url = Config.GetURL('/api/VC/UpdateVCWithMultipleAttachment');
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            let data = { 'File': payload };
            formData.append(JSON.stringify(payload), 'Data');
            resumeMeta.forEach(element => {
                formData.append('file', element);
            });
            // formData.append('file', resumeMeta[0]);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            // xhr.setRequestHeader('Content-Type', undefined);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this._authTokenService.authToken);
            xhr.send(formData);
        });
    }
    AddVendorDiscussionWithAtttachment(payload: any, resumeMeta: any) {
        const url = Config.GetURL('/api/VendorDiscussion/AddVDWithMultipleAttachment');
        //this._spinnerService.show();
        return new Promise((resolve, reject) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            let data = { 'File': payload };
            formData.append(JSON.stringify(payload), 'Data');
            resumeMeta.forEach(element => {
                formData.append('file', element);
            });
            //formData.append('file', resumeMeta[0]);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            // xhr.setRequestHeader('Content-Type', undefined);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this._authTokenService.authToken);
            xhr.send(formData);
            //this._spinnerService.hide();
        });
    }
    cancelRequest(payload: any) {
        const url = Config.GetURL('/api/VMS/BALVMSTransactionList/CancelVMSRequestByVMSId');
        this._spinnerService.show();
        return this.authHttp.post(url, { 'ParentTitle': payload })
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    userActions(payload: any) {
        const url = Config.GetURL('/api/VC/UpdateVCStatus');
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => '');
    }
    replyToChat(payload: any) {
        const url = Config.GetURL('/api/DiscussionBoard/Reply');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    replyToChatWithMail(payload: any) {
        const url = Config.GetURL('/api/DiscussionBoard/ReplyWithMail');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getDownloadedFileVC(attachment: string) {
        const url = Config.GetURL('/api/VC/GetVCAttachments?URL=' + attachment);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getDownloadedFileVD(attachment: string) {
        const url = Config.GetURL('/api/VendorDiscussion/GetDiscussionsAttachment?URL=' + attachment);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    getVendorCommunication() {
        const url = Config.GetURL('/api/VC/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorCommunication_Designer(username: any, type: any) {
        const url = Config.GetURL('/api/VC/GetDesignerVCAndCommunication?userName=' + username + '&VendorCommunication=' + type);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorCommunication_GL(username: any, type: any) {
        const url = Config.GetURL('/api/VC/GetGLVCAndCommunication?userName=' + username + '&VendorCommunication=' + type);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorCommunication_CD(username: any, type: any) {
        const url = Config.GetURL('/api/VC/GetCDVCAndCommunication?userName=' + username + '&VendorCommunication=' + type);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorCommunication_Vendor(username: any, type: any) {
        const url = Config.GetURL('/api/VC/GetVendorsVCAndCommunication?userName=' + username + '&VendorCommunication=' + type);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorDiscussion(usernme: any, role: any) {
        const url = Config.GetURL('/api/VendorDiscussion/GetVDiscussionsByROle?userName=' + usernme + '&Role=' + role);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Success Handler */
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        const body = res.json();
        return body || {};
    }

    /**Error Handler */
    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
