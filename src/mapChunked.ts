
interface MapChunksOptions {
    chunkSize: number
}

export async function mapChunked<A, B>(items: A[], chunkMapper: (chunk: A[]) => Promise<B>, options: MapChunksOptions): Promise<B[]> {
    const results: B[] = []
    const queue = [...items]

    while (queue.length > 0) {
        const chunk = queue.splice(0, options.chunkSize)
        const result = await chunkMapper(chunk)
        results.push(result)
    }

    return results
}
