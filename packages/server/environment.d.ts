declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE: string;
        }
    }
}

export {}