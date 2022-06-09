import { BaseController, ControllerConstructor } from '../../core/BaseController';
import { SiteUri } from './SiteUri';
import { IndexGET } from './actions/IndexGET';

export class SiteController extends BaseController {
    constructor(...args: ConstructorParameters<ControllerConstructor>) {
        super(...args);
        super.setUrls(SiteUri);
        super.setRoute(this.urls.index, [IndexGET]);
    }
}
