import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthTokenService } from './authToken.service';

@Injectable()
export class AuthHttp {
    http: Http;
    constructor(http: Http, private _authTokenService : AuthTokenService) {
        this.http = http;
     }
    createAuthorizationHeader(headers: Headers) {
        if (this._authTokenService.authToken !== '') {
            headers.append('Authorization', 'Bearer ' + this._authTokenService.authToken);
        }
    }

    addServerType(headers: Headers) {
        headers.append('server_type', '');
    }

    addContentType(headers: Headers) {
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token,x-my-custom-header');
    }
    get(url: string) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        this.addServerType(headers);
        this.addContentType(headers);
        const options = new RequestOptions({ headers: headers });
        return this.http.get(url, options);
    }

    post(url: string, data: any) {
        const body = JSON.stringify(data);
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        this.addContentType(headers);
        this.addServerType(headers);
        const options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options);
    }
}
