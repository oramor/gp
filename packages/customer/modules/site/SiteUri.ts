import { BaseUri, UriConstructor } from '../../core/BaseUri';

export class SiteUri extends BaseUri {
    constructor(...args: ConstructorParameters<UriConstructor>) {
        super(...args);
    }

    public get index() {
        return '/';
    }
}
