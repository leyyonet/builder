import {BuilderAny, BuilderGeneric, NewableClass, SetterLambda} from "./types";

export class Builder {
    protected static setter<T>(holder, obj, prop): SetterLambda<T> {
        return (value: unknown) : BuilderGeneric<T> => {
            obj[prop] = value;
            return holder;
        }
    }
    static build<T extends Object>(fn?: NewableClass, ...args: Array<unknown>): BuilderAny<T> {
        let ins: T;
        if (typeof fn === 'function') {
            ins = new fn(...args) as T;
        } else {
            ins = {} as T;
        }
        ins['$return'] = () => {
            if (proxy['$return'] !== undefined) {
                delete proxy['$return'];
            }
            let ins: T;
            if (typeof fn === 'function') {
                try {
                    ins = new fn() as T;
                } catch (e) {
                    ins = {} as T;
                }
            } else {
                ins = {} as T;
            }
            for (const [k, v] of Object.entries(proxy)) {
                const desc = Object.getOwnPropertyDescriptor(proxy, k);
                if (desc) {
                    if (desc.get) {
                        ins[k] = desc.get();
                    } else {
                        ins[k] = desc.value;
                    }
                } else {
                    ins[k] = v;
                }
            }
            return ins as T;
        }
        const setHandler = {
            get: function(obj, prop) {
                if (['constructor', '$return'].includes(prop)) {
                    return obj[prop];
                }
                return Builder.setter(proxy, obj, prop);
            },
            set(obj, prop, value) {
                obj[prop] = value;
            }
        } as unknown as ProxyHandler<T>;
        let proxy = new Proxy(ins, setHandler) as unknown as BuilderGeneric<T>;
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
