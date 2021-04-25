import { AwaitableArray, AwaitedArrayUnordered } from "./types"

export function allUnordered<A extends AwaitableArray>(items: A): Promise<AwaitedArrayUnordered<A>> {
    if (items.length === 0) {
        return Promise.resolve([])
    }

    return new Promise((resolve, reject) => {
        const out: any[] = []
        let cancelled = false

        items.forEach(async item => {
            try {
                out.push(await item)
                if (!cancelled && out.length === items.length) {
                    resolve(out as AwaitedArrayUnordered<A>)
                }
            }
            catch (err) {
                cancelled = true
                reject(err)
            }
        })
    })
}
