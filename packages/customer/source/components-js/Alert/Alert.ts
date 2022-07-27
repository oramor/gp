export class AlertComponent {
    private el: HTMLElement | null;
    private closeTimeout = 5000;
    constructor() {
        this.el = document.querySelector('.js-alert');

        if (!this.el) {
            const bodyEl = document.querySelector('body');

            if (bodyEl) {
                const html = `
                <div class="st-c-alert js-alert">
                    <div class="_container"></div>
                </div >`;

                bodyEl.insertAdjacentHTML('afterbegin', html);
                this.el = document.querySelector('.js-alert');
            }
        }
    }

    push(message: string) {
        const containerEl = this.el?.querySelector('._container');
        if (!containerEl) throw new Error('Container element didnt found');

        // Create item
        const itemEl = document.createElement('div');
        itemEl.classList.add('_item');

        // Create message
        const messageEl = document.createElement('p');
        itemEl.classList.add('_message');
        messageEl.textContent = message;
        itemEl.appendChild(messageEl);

        // Create close button
        const removeEl = document.createElement('button');
        removeEl.classList.add('_remove');
        messageEl.after(removeEl);

        // Get first item
        const firstItem = containerEl.getElementsByClassName('_item')[0];

        // Add by reverse order
        firstItem ? firstItem.before(itemEl) : containerEl.append(itemEl);

        removeEl.addEventListener('click', () => {
            this.removeItem(itemEl);
        });

        setTimeout(() => {
            this.removeItem(itemEl);
        }, this.closeTimeout);
    }

    removeItem(el: HTMLElement) {
        el.classList.add('js-transparent');
        setTimeout(() => {
            el.remove();
        }, 400);
    }

    hide() {
        this.el?.classList.remove('js-overlay-show');
    }

    show() {
        this.el?.classList.add('js-overlay-show');
    }
}
