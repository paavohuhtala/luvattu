import ava from "ava"
import { mapSeries } from './mapSeries'

ava("mapSeries: 0 elements", async t => {
    const results = await mapSeries([], async x => x + 1)
    t.deepEqual(results, [])
})

ava("mapSeries: 1 element", async t => {
    const results = await mapSeries([1], async x => x + 1)
    t.deepEqual(results, [2])
})

ava("mapSeries: 100 elements", async t => {
    const input = [...Array(100)].map((_, i) => i)
    const expected = input.map(i => i + 1)

    const results = await mapSeries(input, async x => x + 1)
    t.deepEqual(results, expected)
})

ava("mapSeries: throws if mapper throws on any element", async t => {
    const input = [1, 2, 3]
    await t.throwsAsync(
        mapSeries(input, async x => {
            if (x === 2) {
                throw new Error(`Failed on ${x}`)
            }
            return x + 1
        }),
        { message: "Failed on 2" }
    )
})

ava("mapSeries: runs in order", async t => {
    const input = [1, 2, 3]
    const processedElements: number[] = []

    await mapSeries(input, async x => {
        processedElements.push(x)
        return x * 100
    })

    t.deepEqual(processedElements, input)
})
