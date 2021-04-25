import Benchmark from "benchmark"
import { allUnordered } from "../src/allUnordered"

// https://github.com/bestiejs/benchmark.js/issues/176#issuecomment-812163728
function p(fn: () => Promise<unknown>) {
    return {
      defer: true,
      async fn(deferred: any) {
        await fn()
        deferred.resolve()
      }
    }
  }


const repeatF = <T>(n: number, f: (i: number) => T): T[] => {
    const out = Array(n)

    for (let i = 0; i < n; i++) {
        out[i] = f(i)
    }

    return out
}

const suite = new Benchmark.Suite("allLimit")

const getInput = () => repeatF(1000, i => new Promise(resolve => setTimeout(() => resolve(i), 0)))

suite.add("Promise.all", p(async () => {
    const input = getInput()
    await Promise.all(input)
}))

suite.add("allUnordered", p(async () => {
    const input = getInput()
    await allUnordered(input)
}))

suite.on("cycle", (event: any) => {
    console.log(String(event.target))
})

suite.run({ 'async': true })
