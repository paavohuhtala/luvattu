import { AwaitableObject, AwaitedObject } from "./types"

export class PropsPromiseError extends Error {
    constructor(public prop: string, public innerError: Error) {
        super()
        this.message = `Promise in prop "${prop}" threw: ${innerError}`
    }
}

/**
 * Compose an object consisting of `Promise` fields into a single `Promise`. Like `Promise.all`,
 * but with an object.
 * @param obj An object where each field is a `Promise`
 * @returns An object with the same fields as `obj` but awaited
 * @throws Throws a `PropsPromiseError` if any inner `Promise` rejects.
 */
export async function props<O extends AwaitableObject>(obj: O): Promise<AwaitedObject<O>> {
    const awaitedEntries = await Promise.all(
        Object.entries(obj).map(
            async ([prop, value]) => {
                try {
                    const awaited = await value
                    return [prop as keyof O, awaited]
                }
                catch (err) {
                    throw new PropsPromiseError(prop, err)
                }
            }
        )
    )

    return Object.fromEntries(awaitedEntries)
}
