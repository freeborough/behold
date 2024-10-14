import postgres from "postgres"

export const sql = postgres(process.env.DATABASE)
export default sql