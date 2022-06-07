import { URL } from 'url';
import { GlobalContext } from './types/utils';

export abstract class BaseUri {
    baseUrl: string;
    constructor(public g: GlobalContext) {
        this.baseUrl = g.config.baseUrl;
    }

    protected getUrlString(uri: string): string {
        return new URL(uri, this.baseUrl).toString();
    }
}
