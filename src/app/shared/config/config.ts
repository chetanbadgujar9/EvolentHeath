export class Config {

    public static getLogoURL(): string {
         let LogoURL = 'http://ak-wks-1487:31995';
        // const LogoURL = 'http://aheadvcs';
        return LogoURL;
    }
    public static GetURL(apiURL: string): string {
         const baseURL = 'http://ak-wks-1468:8082';
        // let baseURL = 'http://ahead-spsearch:8082';
        return baseURL + apiURL;
    }
}
