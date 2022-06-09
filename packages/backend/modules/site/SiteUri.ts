import { BaseUri, UriConstructor } from '../../core/BaseUri';

export class SiteUri extends BaseUri {
    constructor(...args: ConstructorParameters<UriConstructor>) {
        super(...args);
    }

    get index() {
        return '/';
    }
}
