import { UrlObject } from "url";

export class BaseUri {
    baseUrl: UrlObject;

    constructor() {
        this.baseUrl = new URL('http://localhost');
    }

    protected getUrl(uri: string): string {
        const url: UrlObject = {
            hostname: uri,
            ...this.baseUrl
        };
        return url.toString();
    }
}