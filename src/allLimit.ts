import { AwaitableArray, AwaitedArray } from "./types"
import { ArgumentError } from "./error"

export interface AllOptions {
    concurrency?: number
}

const defaultOptions: AllOptions = { concurrency: undefined }

export async function allLimitOrdered<A extends AwaitableArray>(items: A, options: AllOptions = defaultOptions): Promise<AwaitedArray<A>> {
    if (options.concurrency !== undefined && (options.concurrency < 1 || !Number.isInteger(options.concurrency))) {
        throw new ArgumentError("options.concurrency", "Must be an integer greater or equal to 1")
    }

    if (items.length === 0) {
        return [] as unknown as AwaitedArray<A>
    }

    const concurrency = Math.min(options.concurrency ?? items.length, items.length) 

    const taskQueue = items.map((task, index) => [index, task] as const)
    const output = Array(items.length)
    const workers = []

    for (let i = 0; i < concurrency; i++) {
        workers.push(
            (async () => {
                while (taskQueue.length > 0) {
                    const [index, task] = taskQueue.pop()!
                    output[index] = await task
                }
            })()
        )
    }

    await Promise.all(workers)
    return output as AwaitedArray<A>
}
