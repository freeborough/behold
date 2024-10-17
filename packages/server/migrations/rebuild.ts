import "dotenv/config"
import { up, down } from "./base"

export async function main() {
    console.log("BEHOLD migrate:rebuild\n")
    await down()
    await up()
    process.exit(0)
}

main()