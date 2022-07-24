import { AnnotationMapEntry } from 'mobx';

export type MakeObservableOptions<T = any> = {
    [P in Exclude<keyof T, 'toString'>]?: AnnotationMapEntry;
};
