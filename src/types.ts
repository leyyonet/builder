export type SetterGeneric<T, V> = (value: V) => BuilderAny<T>;
export type SetterLambda<T> = (value: unknown) => BuilderAny<T>;
export type BuilderGeneric<T, K extends keyof T = keyof T> = {
    [P in K]: SetterGeneric<T, T[P]>;
};
export interface BuilderGenericReturn<T> {
    $finalize(): T;
}
export type BuilderAny<T, K extends keyof T = keyof T> = BuilderGeneric<T,  K> & BuilderGenericReturn<T>;

export interface NewableClass {
    new(...args: any[]): {};
}