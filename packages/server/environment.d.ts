declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE: string
            SESSION_SECRET: string
            SERVER_NAME?: string
            SERVER_PORT?: string
            SERVER_HOST?: string
        }
    }
}

export {}