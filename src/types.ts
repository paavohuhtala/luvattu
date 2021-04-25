
export type AwaitResult<T> = T extends Promise<infer P> ? AwaitResult<P> : T

export type AwaitableObject = Record<string, Promise<any>>
export type AwaitedObject<O extends AwaitableObject> = { [K in keyof O]: AwaitResult<O[K]> }

export type AwaitableArray = Array<Promise<any>>
export type AwaitedTuple<A extends AwaitableArray> = { [I in keyof A]: AwaitResult<A[I]> }
export type AwaitedArrayUnordered<A extends AwaitableArray> = Array<AwaitResult<A[number]>>
