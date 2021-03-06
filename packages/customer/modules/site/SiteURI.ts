import { BaseUri, UriConstructor } from '../../core/BaseUri';
import { siteURI } from './SiteStatic';

export class SiteURI extends BaseUri {
    constructor(...args: ConstructorParameters<UriConstructor>) {
        super(...args);
    }

    public get index() {
        return siteURI.index;
    }
}
