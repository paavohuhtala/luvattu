import ava from "ava"
import { allLimitOrdered, allLimitUnordered } from "./allLimit"

function sharedTests(name: "allLimitOrdered" | "allLimitUnordered", impl: typeof allLimitOrdered) {
    ava(`${name}: zero`, async t => {
        const result = await impl([])
        t.deepEqual(result, [])
    })

    ava(`${name}: one`, async t => {
        const result = await impl([Promise.resolve(100)])
        t.deepEqual(result, [100])
    })

    ava(`${name}: one with 100 concurrency`, async t => {
        const result = await impl([Promise.resolve(123)], { concurrency: 100 })
        t.deepEqual(result, [123])
    })

    ava(`${name}: throws if concurrency is less than 1`, async t => {
        await t.throwsAsync(impl([], { concurrency: -1 }), null, 'Should reject -1')
        await t.throwsAsync(impl([], { concurrency: Math.PI }), null, 'Should reject Math.Pi')
        await t.throwsAsync(impl([], { concurrency: 0 }), null, 'Should reject 0')
        await t.throwsAsync(impl([], { concurrency: 0.5 }), null, 'Should reject 0.5')
        await t.throwsAsync(impl([], { concurrency: NaN }), null, 'Should reject NaN')
        await t.throwsAsync(impl([], { concurrency: -Infinity }), null, 'Should reject -Infinity')
        await t.throwsAsync(impl([], { concurrency: Infinity }), null, 'Should reject Infinity')
    })
}

sharedTests("allLimitOrdered", allLimitOrdered)
sharedTests("allLimitUnordered", allLimitUnordered)

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

    const results = await allLimitOrdered(promises, { concurrency: 5 })
    t.is(results.length, 100)

    t.deepEqual(results, values)
})

ava("allLimitUnordered: all elements are present with 100 elements", async t => {
    const promises = Array(100)

    for (let i = 0; i < promises.length; i++) {
        promises[i] = Promise.resolve(i)
    }

    const results = await allLimitUnordered(promises, { concurrency: 5 })
    t.is(results.length, 100)

    for (let i = 0; i < 100; i++) {
        t.truthy(results.includes(i), `Array should contain ${i}`)
    }
})
