import { URL } from 'url';
import { GlobalContext } from './types/utils';

export type UriConstructor = new (g: GlobalContext) => BaseUri;

export abstract class BaseUri {
    g: GlobalContext;
    baseUrl: string;
    constructor(...args: ConstructorParameters<UriConstructor>) {
        this.g = args[0];
        this.baseUrl = this.g.config.baseUrl;
    }

    protected getUrlString(uri: string): string {
        return new URL(uri, this.baseUrl).toString();
    }
}
