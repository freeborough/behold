export interface Error {
    kind: string,
    message: string,
}

export interface ErrorWithData<T> extends Error {
    data: T,
}
