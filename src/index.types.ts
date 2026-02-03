export type BuilderSetterGeneric<T, V> = (value: V) => BuilderAny<T>;
export type BuilderSetterLambda<T> = (value: unknown) => BuilderAny<T>;
export type BuilderGeneric<T, K extends keyof T = keyof T> = {
    [P in K]: BuilderSetterGeneric<T, T[P]>;
};
export type BuilderCallbackMethod<T> = (cb: BuilderCallbackLambda<T>) => BuilderAny<T>;
export type BuilderCallbackLambda<T> = (value: T) => void;
export type BuilderSetItemLambda<T> = (key: keyof T, value: T[keyof T]) => void;
export type BuilderSetItemMethod<T> = (cb: BuilderSetItemLambda<T>) => BuilderAny<T>;
export interface BuilderWithProxy<T> {
    $finalize(): T;
    $callback(cb: BuilderCallbackLambda<T>): BuilderAny<T>;
    $setItem(cb: BuilderSetItemLambda<T>): BuilderAny<T>;
}
export type BuilderAny<T, K extends keyof T = keyof T> = BuilderGeneric<T,  K> & BuilderWithProxy<T>;

export interface NewableClass<T = object> {
    new(...args: any[]): T;
    prototype?: any;
}
export type BuilderLambda<T> = (builder: BuilderAny<T>) => BuilderAny<T> | T;
