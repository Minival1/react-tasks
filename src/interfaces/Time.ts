export interface Time {
    format: string,
    min: Date,
    max: Date,
    steps: { minute: number },
    list: Array<{ time: string, steps: string[] }>,
}
