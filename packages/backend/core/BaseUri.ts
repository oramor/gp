import { UrlObject } from "url";
import { GlobalContext } from "./types/context";

export class BaseUri {
    baseUrl: UrlObject;

    constructor(public g: GlobalContext) {
        this.baseUrl = new URL(g.config.baseUrl);
    }

    protected getUrl(uri: string): string {
        const url: UrlObject = {
            hostname: uri,
            ...this.baseUrl
        };
        return url.toString();
    }
}