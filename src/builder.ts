import {BuilderGeneric, NewableClass, SetterLambda} from "./types";

export class Builder {
    protected static setter<T>(holder, obj, prop): SetterLambda<T> {
        return (value: unknown) : BuilderGeneric<T> => {
            obj[prop] = value;
            return holder;
        }
    }
    static build<T extends Object>(fn?: NewableClass): BuilderGeneric<T> {
        const setHandler = {
            get: function(obj, prop) {
                return Builder.setter(proxy, obj, prop);
            },
            set(obj, prop, value) {
                obj[prop] = value;
            }
        } as unknown as ProxyHandler<T>;
        let ins: T;
        if (typeof fn === 'function' && fn.length === 0) {
            ins = new fn() as T;
        } else {
            ins = {} as T;
        }
        const proxy = new Proxy(ins, setHandler) as unknown as BuilderGeneric<T>;
        return proxy;
    }
}
