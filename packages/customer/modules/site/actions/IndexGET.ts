import { BaseAction, ActionConstructor } from '../../../core/BaseAction';

export class IndexGET extends BaseAction {
    constructor(...args: ConstructorParameters<ActionConstructor>) {
        super(...args);
    }
    async run() {
        return this.data({ name: 'hello' });
    }
}
