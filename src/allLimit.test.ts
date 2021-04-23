import ava from "ava"
import { allLimitOrdered } from "./allLimit"

ava("allLimitOrdered: zero", async t => {
    const result = await allLimitOrdered([])
    t.deepEqual(result, [])
})

ava("allLimitOrdered: one", async t => {
    const result = await allLimitOrdered([Promise.resolve(100)])
    t.deepEqual(result, [100])
})

ava("allLimitOrdered: order is maintained with three elements", async t => {
    const result = await allLimitOrdered([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
    ])
    t.deepEqual(result, [1, 2, 3])
})

ava("allLimitOrdered: order is maintained with 100 elements", async t => {
    const values = Array(100)
    const promises = Array(100)

    for (let i = 0; i < values.length; i++) {
        values[i] = i
        promises[i] = Promise.resolve(i)
    }

    const result = await allLimitOrdered(promises, { concurrency: 5 })
    t.deepEqual(result, values)
})

ava("allLimitOrdered: throws if concurrency is less than 1", async t => {
    await t.throwsAsync(allLimitOrdered([], { concurrency: -1 }), null, 'Should reject -1')
    await t.throwsAsync(allLimitOrdered([], { concurrency: Math.PI }), null, 'Should reject Math.Pi')
    await t.throwsAsync(allLimitOrdered([], { concurrency: 0 }), null, 'Should reject 0')
    await t.throwsAsync(allLimitOrdered([], { concurrency: 0.5 }), null, 'Should reject 0.5')
    await t.throwsAsync(allLimitOrdered([], { concurrency: NaN }), null, 'Should reject NaN')
    await t.throwsAsync(allLimitOrdered([], { concurrency: -Infinity }), null, 'Should reject -Infinity')
    await t.throwsAsync(allLimitOrdered([], { concurrency: Infinity }), null, 'Should reject Infinity')
})
