import React from 'react';

export namespace ReactEvents {
    export type InputUpdateEvent = React.FocusEvent<HTMLInputElement>;
}

export namespace ReactHandlers {
    export type InputUpdateHandler = (ev: ReactEvents.InputUpdateEvent) => void;
}
