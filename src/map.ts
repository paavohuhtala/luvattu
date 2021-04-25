import { ArgumentError } from "./error"
import { allUnordered } from "."

export interface MapOptions {
    /**
     * The maximum number of Promises to evaluate in parallel. Defaults to unlimited.
     */
    concurrency?: number
}

export type ValidatedMapOptions = Required<MapOptions>

const defaultOptions: MapOptions = { concurrency: undefined }

function validateMapOptions(items: unknown[], options: MapOptions = defaultOptions): ValidatedMapOptions {
    if (options.concurrency !== undefined && (!Number.isSafeInteger(options.concurrency) || options.concurrency < 1)) {
        throw new ArgumentError("options.concurrency", `Must be an integer greater or equal to 1 (was ${options.concurrency})`)
    }

    return {
        concurrency: Math.min(options.concurrency ?? items.length, items.length)
    }   
}

export async function map<A, B>(items: A[], mapper: (x: A) => Promise<B>, options: MapOptions = defaultOptions): Promise<B[]> {
    const { concurrency } = validateMapOptions(items, options)

    if (items.length === 0) {
        return []
    }

    const taskQueue = items.map((task, index) => [index, task] as const)
    const output: B[] = Array(items.length)
    const workers: Promise<void>[] = []

    for (let i = 0; i < concurrency; i++) {
        workers.push(
            (async () => {
                while (taskQueue.length > 0) {
                    const [index, task] = taskQueue.pop()!
                    output[index] = await mapper(task)
                }
            })()
        )
    }

    await allUnordered(workers)
    return output
}

export async function mapUnordered<A, B>(items: A[], mapper: (x: A) => Promise<B>, options: MapOptions = defaultOptions): Promise<B[]> {
    const { concurrency } = validateMapOptions(items, options)

    if (items.length === 0) {
        return []
    }

    const taskQueue = [...items]
    const workers: Promise<void>[] = []
    const output: any[] = []

    for (let i = 0; i < concurrency; i++) {
        workers.push(
            (async () => {
                while (taskQueue.length > 0) {
                    const task = taskQueue.pop()!
                    output.push(await mapper(task))
                }
            })()
        )
    }

    await allUnordered(workers)
    return output
}
