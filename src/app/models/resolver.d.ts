
export interface Resolver{
    resolve(message: Array<string>, type: "success", fadeDelay?: number): void;
    clear(): void;
}