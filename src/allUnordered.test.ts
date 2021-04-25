import ava from "ava"
import { allUnordered } from "./allUnordered"

ava(`allUnordered: zero`, async t => {
    const result = await allUnordered([])
    t.deepEqual(result, [])
})

ava(`allUnordered: one`, async t => {
    const result = await allUnordered([Promise.resolve(100)])
    t.deepEqual(result, [100])
})

ava(`allUnordered: mixed types`, async t => {
    const inputs = [100, "abc", { hello: Symbol("world") }] as const
    const promisedInputs = inputs.map(x => Promise.resolve(x))
    const results = await allUnordered(promisedInputs)
    t.is(results.length, inputs.length)

    for (const input of inputs) {
        t.truthy(results.includes(input))
    }
})
 
ava("allUnordered: all elements are present with 100 elements", async t => {
    const promises = Array(100)

    for (let i = 0; i < promises.length; i++) {
        promises[i] = Promise.resolve(i)
    }

    const results = await allUnordered(promises)
    t.is(results.length, 100)

    for (let i = 0; i < 100; i++) {
        t.truthy(results.includes(i), `Array should contain ${i}`)
    }
})
 
ava("allUnordered: should throw if one element throws", async t => {
    const promises = Array(100)

    for (let i = 0; i < promises.length; i++) {
        promises[i] = Promise.resolve(i)
    }

    promises[56] = Promise.reject(new Error("Something went wrong"))

    await t.throwsAsync(allUnordered(promises), {
        message: "Something went wrong"
    })
})
