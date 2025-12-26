export type SetterGeneric<T, V> = (value: V) => BuilderAny<T>;
export type SetterLambda<T> = (value: unknown) => BuilderAny<T>;
export type BuilderGeneric<T, K extends keyof T = keyof T> = {
    [P in K]: SetterGeneric<T, T[P]>;
};
export type BuilderFinalizeLambda<T> = () => T;
export type BuilderSetLambda<T> = (cb: BuilderCallbackLambda<T>) => BuilderAny<T>;
export type BuilderCallbackLambda<T> = (value: T) => void;
export type BuilderLambdaTuple<T> = [BuilderFinalizeLambda<T>, BuilderSetLambda<T>]; // $finalize, $callback
export interface BuilderWithProxy<T> {
    $finalize(): T;
    $callback(cb: BuilderCallbackLambda<T>): BuilderAny<T>;
}
export type BuilderAny<T, K extends keyof T = keyof T> = BuilderGeneric<T,  K> & BuilderWithProxy<T>;

export interface NewableClass<T = object> {
    new(...args: any[]): T;
    prototype?: any;
}
export type BuilderLambda<T> = (builder: BuilderAny<T>) => BuilderAny<T> | T;
