import { BaseController, ControllerConstructor } from '../../core/BaseController';
import { ProfileURI } from './ProfileURI';
import { LoginPOST } from './actions/LoginPOST';

export class ProfileController extends BaseController<ProfileURI> {
    public urls: ProfileURI;
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        super(...args);
        this.urls = new ProfileURI(this.g);
        this.setRoute(this.urls.login, [LoginPOST]);
    }
}
