import { BaseAction, ActionConstructor } from '../../../core/BaseAction';
import { MainPageServ } from '../pages/MainPage/MainPageServ';

export class IndexGET extends BaseAction {
    constructor(...args: ConstructorParameters<ActionConstructor>) {
        super(...args);
    }
    async run() {
        const page = new MainPageServ(this.g, this.ctx);
        return this.render(page);
    }
}
