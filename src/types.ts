
export type AwaitResult<T> = T extends Promise<infer P> ? AwaitResult<P> : T

export type AwaitableObject = Record<string, Promise<any>>

export type AwaitedObject<O extends AwaitableObject> = { [K in keyof O]: AwaitResult<O[K]> }
