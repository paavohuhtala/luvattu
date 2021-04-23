
export class ArgumentError extends Error {
    constructor(argName: string, message: string) {
        super()
        this.message = `Invalid argument ${argName}: ${message}`
    }
}
