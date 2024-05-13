// forEach.ts

export function forEach<T>(items: T[], callback: (item: T) => void): void {
    for (const item of items) {
        callback(item);
    }
}
