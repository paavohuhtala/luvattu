import ava from "ava"
import { props, PropsPromiseError } from './props'

ava("props: await zero props", async t => {
    const result = await props({})
    t.deepEqual(result, {})
})

ava("props: await one prop", async t => {
    const result = await props({ a: Promise.resolve(100) })
    t.deepEqual(result, { a: 100 })
})

ava("props: await two props", async t => {
    const result = await props({ a: Promise.resolve("hello"), b: Promise.resolve("world") })
    t.deepEqual(result, { a: "hello", b: "world" })
})

ava("props: should throw if one prop throws", async t => {
    await t.throwsAsync(
        () => props({ a: Promise.reject(new Error("failure")) }),
        { instanceOf: PropsPromiseError, message: `Promise in prop "a" threw: Error: failure` }
    )
})

ava("props: only awaits one layer", async t => {
    const innerPromise = Promise.resolve(10)
    const result = await props({ outer: Promise.resolve({ inner: innerPromise }) })
    t.deepEqual(result, { outer: { inner: innerPromise } })
})
