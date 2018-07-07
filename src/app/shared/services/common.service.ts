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
import { SpinnerService } from '../spinner/spinner.service';
import { Config } from '../config/config';
import { AuthHttp } from '../services/authHttp.service';
import { AuthInfo } from '../../models/authInfo';
import { AuthTokenService } from './authToken.service';

@Injectable()
export class CommonService {
    http: Http;
    VCID: any = '';
    constructor(http: Http,
        private authHttp: AuthHttp,
        private _spinnerService: SpinnerService,
        private router: Router,
        private _authTokenService: AuthTokenService) {
        this.http = http;
    }
    onTitleClick() {
        this.router.navigate(['/brand']);
    }
    // Get user auth token
    getAuthToken(credentials: AuthInfo) {
        const authenticateUrl = Config.GetURL('/api/Auth/Token');
        this._spinnerService.show();
        const headers = new Headers();
        const credentialString: string = 'grant_type=password&username=' + credentials.UserName + '&password=' + credentials.Password;
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const options = new RequestOptions({ headers: headers });
        return this.http.post(authenticateUrl, credentialString, options)
            .map((res: Response) => {
                this.setToken(res); // this.emitAuthEvent(true);
            })
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }

    // Get Logged In User Data
    getLoggedInUserDetails(username: any) {
        const url = Config.GetURL('/api/UGP/GetUGPDetailsByUserName?userName=' + username);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getGLMapping(username: any) {
        const url = Config.GetURL('/api/UGP/GetUserGLMappingByName?userName=' + username);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    // Get Admin Access
    getAdminAccess(username: any) {
        const url = Config.GetURL('/api/rms/farmadminusers/FarmAdminUsersByUserLoginName?userLoginName=' + username);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getAssignToUsers(username: string) {
        const url = Config.GetURL('/api/UGP/GetUserDetailsByName?userName=' + username);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getBrand() {
        const url = Config.GetURL('/api/Brands/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addBrand(payload: any) {
        const url = Config.GetURL('/api/Brands/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateBrand(payload: any) {
        const url = Config.GetURL('/api/Brands/UpdateBrandByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deleteBrand(value: any) {
        const url = Config.GetURL('/api/Brands/DeleteBrandByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getPurposeMaster() {
        const url = Config.GetURL('/api/VMS/BALVMSPurposeMaster/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addPurpose(payload: any) {
        const url = Config.GetURL('/api/VMS/BALVMSPurposeMaster/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updatePurpose(payload: any) {
        const url = Config.GetURL('/api/VMS/BALVMSPurposeMaster/UpdateBALVMSPurposeMasterByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deletePurpose(value: any) {
        const url = Config.GetURL('/api/VMS/BALVMSPurposeMaster/DeleteBALVMSPurposeMasterByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getBrandMaster() {
        const url = Config.GetURL('/api/Brands/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getCategory() {
        const url = Config.GetURL('/api/Category/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getSystem() {
        const url = Config.GetURL('/api/Masters/GetSystems');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getRequirement() {
        const url = Config.GetURL('/api/Masters/GetRequirements');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendor() {
        const url = Config.GetURL('/api/Vendor/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorByCategory(category: any) {
        const url = Config.GetURL('/api/Vendor/GetVendorByCategory?Category=' + category);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getProjectByBrand(brand) {
        const url = Config.GetURL('/api/Masters/GetProjectsByBrandName?BrandName=' + brand);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    validatePartNo(partno, revid) {
        const url = Config.GetURL('/api/TeamCenter/GetPartDescriptionByPartNumberAndRevisionID?partNumber=' + partno + '&revisionID=' + revid);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getProjectMaster() {
        const url = Config.GetURL('/api/vms/ProjectMaster/GetActiveProjectMaster');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getPlantMaster() {
        const url = Config.GetURL('/api/vms/PlantMaster/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVMSPlantMaster() {
        const url = Config.GetURL('/api/vms/BALVMSPlantInfoList/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addVMSPlantMaster(payload: any) {
        const url = Config.GetURL('/api/VMS/BALVMSPlantInfoList/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateVMSPlantMaster(payload: any) {
        const url = Config.GetURL('/api/VMS/BALVMSPlantInfoList/UpdatePlantInfoByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deleteVMSPlantMaster(value: any) {
        const url = Config.GetURL('/api/VMS/BALVMSPlantInfoList/DeletePlantInfoByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getBrandpmtc() {
        const url = Config.GetURL('/api/VMS/BrandPMTC/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addBrandpmtc(payload: any) {
        const url = Config.GetURL('/api/VMS/BrandPMTC/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateBrandpmtc(payload: any) {
        const url = Config.GetURL('/api/VMS/BrandPMTC/UpdateBrandPMTCByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deleteBrandpmtc(value: any) {
        const url = Config.GetURL('/api/VMS/BrandPMTC/DeleteBrandPMTCByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVendorMapping() {
        const url = Config.GetURL('/api/VendorMapping/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addVendorMapping(payload: any) {
        const url = Config.GetURL('/api/VendorMapping/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateVendorMapping(payload: any) {
        const url = Config.GetURL('/api/VendorMapping/UpdateVendorMappingByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deleteVendorMapping(value: any) {
        const url = Config.GetURL('/api/VendorMapping/DeleteVendorMappingByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVehicleLocation() {
        const url = Config.GetURL('/api/VMS/VehicleLocation/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    addVehicleLocation(payload: any) {
        const url = Config.GetURL('/api/VMS/VehicleLocation/Post');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    updateVehicleLocation(payload: any) {
        const url = Config.GetURL('/api/VMS/VehicleLocation/UpdateVehicleLocationByID');
        this._spinnerService.show();
        return this.authHttp.post(url, payload)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    deleteVehicleLocation(value: any) {
        const url = Config.GetURL('/api/VMS/VehicleLocation/DeleteVehicleLocationByID/' + value.ID);
        this._spinnerService.show();
        return this.authHttp.post(url, value)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getStatus(role) {
        const url = Config.GetURL('/api/Masters/GetStatusMaster?Role=' + role);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getVehicleModelByBrand(brand: any) {
        const url = Config.GetURL('/api/vms/BrandPMTC/GetVehicleModelsByBrand?brand=' + brand);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    GetProjectByBrandName(brand: any) {
        const url = Config.GetURL('/api/VMS/BPM/GetProjectByBrandName?brandName=' + brand);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    GetProjectByBrandNameAndBatchType(brand: any, batchtype: any) {
        const url = Config.GetURL('/api/VMS/BPM/GetProjectByBrandNameAndBatchType?brandName=' + brand + '&batchType=' + batchtype);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getMyData(username: any) {
        const url = Config.GetURL('/api/cashpurchase/RndUsers/GetRndUsersListByName?userName=' + username);
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    getRMSMenus() {
        const url = Config.GetURL('/api/CashPurchase/NavigationMaster/Get');
        this._spinnerService.show();
        return this.authHttp.get(url)
            .map(this.extractData)
            .catch(this.handleError)
            .finally(() => this._spinnerService.hide());
    }
    /**Set Token in localstorage */
    private setToken(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        const body = res.json();
        this._authTokenService.authToken = body.access_token;
        //sessionStorage.setItem('access_token', body.access_token);
        return body || {};
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
