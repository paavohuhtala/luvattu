
export async function mapSeries<A, B>(input: A[], mapper: (x: A) => Promise<B>): Promise<B[]> {
    const results = []

    for (const element of input) {
        results.push(await mapper(element))
    }

    return results
}
