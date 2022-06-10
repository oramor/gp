import { BaseAction, ActionConstructor } from '../../../core/BaseAction';

export class FaviconGET extends BaseAction {
    constructor(...args: ConstructorParameters<ActionConstructor>) {
        super(...args);
    }
    async run() {
        return this.data({ name: 'favicon' });
    }
}
