import { BaseController, ControllerConstructor } from '../../core/BaseController';
import { SiteURI } from './SiteURI';
import { IndexGET } from './actions/IndexGET';

export class SiteController extends BaseController<SiteURI> {
    public urls: SiteURI;
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        super(...args);
        this.urls = new SiteURI(this.g);
        this.setRoute(this.urls.index, [IndexGET]);
    }
}
