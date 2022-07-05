import { BaseController, ControllerConstructor } from '../../core/BaseController';
import { SiteUri } from './SiteUri';
import { IndexGET } from './actions/IndexGET';
import { FaviconGET } from './actions/FaviconGET';

export class SiteController extends BaseController<SiteUri> {
    public urls: SiteUri;
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        super(...args);
        this.urls = new SiteUri(this.g);
        this.setRoute(this.urls.favicon, [FaviconGET]);
        this.setRoute(this.urls.index, [IndexGET]);
    }
}
