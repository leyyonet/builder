import { BuilderAny, NewableClass, SetterLambda } from './types';

const RETURN_FNC = '$finalize';
type O = Object;

// noinspection JSUnusedGlobalSymbols
export class Builder {
    protected static setter<T extends O>(holder: BuilderAny<T>, obj: T, prop: keyof T): SetterLambda<T> {
        return (value: T[keyof T]) : BuilderAny<T> => {
            obj[prop] = value;
            return holder;
        }
    }
    protected static key(key: unknown) {
        switch (typeof key) {
            case "string":
                return key;
            case "number":
            case "bigint":
                return key.toString(10);
            case "boolean":
                return key ? 'true' : 'false';
        }
        return null;
    }
    protected static tupleProps<T extends O>(ins: T, tuples: Array<[keyof T, T[keyof T]]>) {
        tuples.forEach(item => {
            if (Array.isArray(item) && item.length === 2) {
                const [k, v] = item;
                const key = this.key(k);
                if (key) {
                    ins[key] = v;
                }
            }
        });
    }
    protected static objectProps<T extends O>(ins: T, values: Partial<T>) {
        if (values instanceof Map) {
            // because map can contain non-plain keys
            values.forEach((k, v) => {
                const key = this.key(k);
                if (key) {
                    ins[key] = v;
                }
            });
        }
        else {
            for (const [k, v] of Object.entries(values)) {
                const key = this.key(k);
                if (key) {
                    ins[key] = v;
                }
            }
        }
    }
    static build<T extends O>(fn?: NewableClass, value?: Partial<T>): BuilderAny<T>
    static build<T extends O>(fn?: NewableClass, args?: Array<unknown>): BuilderAny<T>
    static build<T extends O>(fn?: NewableClass, args?: T|Array<unknown>): BuilderAny<T> {
        let ins: T;
        if (typeof fn === 'function') {
            if (Array.isArray(args)) {
                ins = new fn(...args) as T;
            }
            else if (args && typeof args === 'object') {
                ins = new fn() as T;
                this.objectProps(ins, args);
            }
            else {
                ins = new fn() as T;
            }
        } else {
            ins = {} as T;
            if (Array.isArray(args)) {
                this.tupleProps(ins, args as Array<[keyof T, T[keyof T]]>);
            }
            else if (args && typeof args === 'object') {
                this.objectProps(ins, args as Partial<T>);
            }
        }
        ins[RETURN_FNC] = () => {
            if (proxy[RETURN_FNC] !== undefined) {
                delete proxy[RETURN_FNC];
            }
            let doc: T;
            if (typeof fn === 'function') {
                try {
                    doc = new fn() as T;
                } catch (e) {
                    doc = {} as T;
                }
            } else {
                doc = {} as T;
            }
            for (const [k, v] of Object.entries(proxy)) {
                const desc = Object.getOwnPropertyDescriptor(proxy, k);
                if (desc) {
                    if (desc.get) {
                        doc[k] = desc.get();
                    } else {
                        doc[k] = desc.value;
                    }
                } else {
                    doc[k] = v;
                }
            }
            return doc as T;
        }
        const setHandler = {
            get: function(obj: T, prop: keyof T) {
                if (['constructor', RETURN_FNC].includes(prop as string)) {
                    return obj[prop];
                }
                return Builder.setter(proxy, obj, prop);
            },
            set(obj: T, prop: keyof T, value: T[keyof T]) {
                obj[prop] = value;
            }
        } as unknown as ProxyHandler<T>;
        const proxy = new Proxy(ins, setHandler) as unknown as BuilderAny<T>;
        if (typeof fn === 'function') {
            Object.defineProperty(proxy.constructor, 'name', {
                configurable: true,
                enumerable: true,
                value: fn.name,
                writable: false,
            });
        }
        return proxy as BuilderAny<T>;
    }
}
