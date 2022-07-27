import { URL } from 'url';
import { GlobalContext } from './types/utils';

/**
 * Статические ссылки, вынесены в отдельный файл для статики (например,
 * SiteStatic.siteUri), что позволяет использовать их как на фронтенде,
 * так и на бекенде (в противном случае пришлоось бы тянуть на фронт
 * класс вида SiteURI, что не позволило бы использовать в таких классах
 * серверное API ноды)
 */

export type UriConstructor = new (g: GlobalContext) => BaseUri;

export abstract class BaseUri {
    protected g: GlobalContext;
    protected baseUrl: string;
    constructor(...args: ConstructorParameters<UriConstructor>) {
        this.g = args[0];
        this.baseUrl = this.g.config.baseUrl;
    }

    protected getUrlString(uri: string): string {
        return new URL(uri, this.baseUrl).toString();
    }
}
