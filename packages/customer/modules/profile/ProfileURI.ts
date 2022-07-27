import { BaseUri, UriConstructor } from '../../core/BaseUri';
import { profileURI } from './ProfileStatic';

export class ProfileURI extends BaseUri {
    constructor(...args: ConstructorParameters<UriConstructor>) {
        super(...args);
    }

    public get login() {
        return profileURI.login;
    }
}
