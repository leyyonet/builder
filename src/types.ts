export type SetterGeneric<T, V> = (value: V) => BuilderGeneric<T>;
export type SetterLambda<T> = (value: unknown) => BuilderGeneric<T>;
export type BuilderGeneric<T, K extends keyof T = keyof T> = {
    [P in K]: SetterGeneric<T, T[P]>;
};
export interface NewableClass {
    new(...args: any[]): {};
}