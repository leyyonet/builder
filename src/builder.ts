import type {
    BuilderAny,
    BuilderCallbackMethod,
    BuilderCallbackLambda,
    BuilderLambda,
    NewableClass,
    SetterLambda, BuilderWithProxy, BuilderSetItemLambda, BuilderSetItemMethod
} from './types';

const SECURES = ['$finalize', '$callback', '$setItem'] as Array<keyof BuilderWithProxy<object>>;

type O = Object | Record<string, unknown>;

// noinspection JSUnusedGlobalSymbols
export class Builder {
    protected static setter<T extends O>(holder: BuilderAny<T>, obj: T, prop: keyof T, fn: BuilderSetItemLambda<T>): SetterLambda<T> {
        return (value: T[keyof T]) : BuilderAny<T> => {
            obj[prop] = value;
            if (typeof fn === 'function') {
                fn(prop, value);
            }
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
    protected static _tupleProps<T extends O>(ins: T, tuples: Array<[keyof T, T[keyof T]]>) {
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
    protected static _objectProps<T extends O>(ins: T, values: Partial<T>) {
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
    protected static _readProp<T>(prop: BuilderAny<T> | Partial<T>): Partial<T> {
        if (prop) {
            const builder = prop as BuilderAny<T>;
            if (typeof builder.$finalize === 'function') {
                builder.$finalize();
            }
            return prop as T;
        }
        return {} as T;
    }
    protected static _fillWithDefaults<T extends O>(p1?: NewableClass<T>|Partial<T>, p2?: Partial<T>|Array<unknown>):Partial<T> {
        // class defined
        if (typeof p1 === 'function') {
            // class constructor arguments are provided
            if (Array.isArray(p2)) {
                return new p1(...p2) as T;
            }
            // any object is provided
            else if (p2 && typeof p2 === 'object') {
                // class instance is provided
                if (p2 instanceof p1) {
                    return p2 as T;
                }
                // simple object is provided as default values
                else {
                    const ins = new p1() as T;
                    this._objectProps(ins, p2);
                    return ins;
                }
            }
            // there is no default values, just create instance
            else {
                return new p1() as T;
            }
        }
        // class instance is not provided
        const obj = {} as T;
        // tuple list is provided as default values
        if (Array.isArray(p1)) {
            this._tupleProps(obj, p1 as Array<[keyof T, T[keyof T]]>);
        }
        // simple object is provided as default values
        else if (p1 && typeof p1 === 'object') {
            this._objectProps(obj, p1 as Partial<T>);
        }
        return obj;
    }

    static build<T extends O>(data?: Partial<T>): BuilderAny<T>;
    static build<T extends O>(fn: NewableClass<T>): BuilderAny<T>;
    static build<T extends O>(fn: NewableClass<T>, args: Array<unknown>): BuilderAny<T>;
    static build<T extends O>(fn: NewableClass<T>, data: Partial<T>): BuilderAny<T>;

    static build<T extends O>(p1?: NewableClass<T>|Partial<T>, p2?: Partial<T>|Array<unknown>): BuilderAny<T> {


        const ins = this._fillWithDefaults(p1, p2) as T;
        let callbackBody: BuilderCallbackLambda<T>;
        let setItemBody: BuilderSetItemLambda<T>;

        (ins as BuilderWithProxy<T>).$finalize = (): T => {
            SECURES.forEach(field => {
                if (proxy[field] !== undefined) {
                    delete proxy[field];
                }
            })
            let doc: T;
            if (typeof p1 === 'function') {
                try {
                    doc = new p1() as T;
                } catch (e) {
                    doc = {} as T;
                }
            }
            else {
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
            if (typeof callbackBody === 'function') {
                callbackBody(doc);
            }
            SECURES.forEach(field => {
                if (doc[field] !== undefined) {
                    delete doc[field];
                }
            })
            return doc as T;
        }
        (ins as BuilderWithProxy<T>).$callback = ((cb: BuilderCallbackLambda<T>) => {
            callbackBody = cb;
            return proxy as unknown as BuilderAny<T>;
        }) as BuilderCallbackMethod<T>;
        (ins as BuilderWithProxy<T>).$setItem = ((cb: BuilderSetItemLambda<T>) => {
            setItemBody = cb;
            return proxy as unknown as BuilderAny<T, keyof T>;
        }) as BuilderSetItemMethod<T>;

        const handler = {
            get(obj: T, prop: keyof T) {
                switch (prop as string) {
                    case 'constructor':
                    case '$finalize':
                    case '$callback':
                    case '$setItem':
                        return obj[prop];
                }
                return Builder.setter(proxy, obj, prop, setItemBody);
            },
            set(obj: T, prop: keyof T, value: T[keyof T]) {
                obj[prop] = value;
            }
        } as unknown as ProxyHandler<T>;
        const proxy = new Proxy(ins, handler) as unknown as BuilderAny<T>;

        if (typeof p1 === 'function') {
            Object.defineProperty(proxy.constructor, 'name', {
                configurable: true,
                enumerable: true,
                value: p1.name ?? 'LeyyoBuilder',
                writable: false,
            });
        }
        return proxy as BuilderAny<T>;
    }

    static retrieve<T extends O>(lambda: BuilderLambda<Partial<T>>, data?: Partial<T>): Partial<T>;
    static retrieve<T extends O>(lambda: BuilderLambda<Partial<T>>, fn: NewableClass<T>): Partial<T>;
    static retrieve<T extends O>(lambda: BuilderLambda<Partial<T>>, fn: NewableClass<T>, value: Partial<T>): Partial<T>;
    static retrieve<T extends O>(lambda: BuilderLambda<Partial<T>>, fn: NewableClass<T>, args: Array<unknown>): Partial<T>;
    static retrieve<T extends O>(lambda: BuilderLambda<Partial<T>>, p1?: NewableClass<T>|Partial<T>, p2?: Partial<T>|Array<unknown>): Partial<T> {
        if (typeof lambda === 'function') {
            return this._readProp(lambda(this.build<Partial<T>>(p1 as NewableClass<T>, p2 as Partial<T>)));
        }
        return this._fillWithDefaults(p1, p2) as T;
    }

}
