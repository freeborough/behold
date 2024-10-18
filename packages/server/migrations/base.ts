import sql from "../src/sql"

export async function up() {
    try {
        process.stdout.write("Up... ")

        await sql`CREATE TABLE users (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name        TEXT NOT NULL,
            username    TEXT NOT NULL UNIQUE,
            password    TEXT NOT NULL
        )`

        await sql`CREATE TABLE games (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            owner_id    UUID NOT NULL REFERENCES users,
            name        TEXT NOT NULL,
            description TEXT,
            slug        TEXT NOT NULL UNIQUE
        )`

        await sql`CREATE TYPE game_players_role AS ENUM('gm', 'player')`

        await sql`CREATE TABLE game_players (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            game_id     UUID NOT NULL REFERENCES games,
            user_id     UUID NOT NULL REFERENCES users,
            role        game_players_role NOT NULL
        )`

        // We're going to fairly frequently be getting all the players of a specific game.
        await sql`CREATE UNIQUE INDEX game_players_game_id_idx ON game_players (game_id)`

        // Everytime someone logs in we're going to get all the games they're playing in.
        await sql `CREATE UNIQUE INDEX game_players_user_id_idx ON  game_players (user_id)`

        await sql`CREATE TABLE scenes (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            game_id     UUID NOT NULL REFERENCES games,
            name        TEXT NOT NULL,
            visible     BOOLEAN NOT NULL DEFAULT FALSE
        )`

        // Everytime someone joins a game, or a scene within that game is created/made visible,
        // we're going to get all the scenes for that game.
        await sql`CREATE UNIQUE INDEX scenes_game_id_idx ON scenes (game_id)`

        await sql`CREATE TABLE layers (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            scene_id    UUID NOT NULL REFERENCES scenes,
            name        TEXT NOT NULL
        )`

        // When a player views a scene, we need to get all the layers within it.
        await sql`CREATE UNIQUE INDEX layers_scene_id_idx ON layers (scene_id)`

        await sql`CREATE TABLE assets (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            owner_id    UUID NOT NULL REFERENCES users,
            name        TEXT NOT NULL,
            url         TEXT NOT NULL,
            tags        TEXT[] NOT NULL DEFAULT '{}'
        )`

        // The default view for assets is to view all of a players own assets.
        await sql`CREATE UNIQUE INDEX assets_owner_id_idx ON assets (owner_id)`

        // We're storing the tags as an array for speed and convenience.  To allow us to quickly
        // search those tags we use a GIN index.
        await sql`CREATE INDEX assets_tags_idx ON assets USING GIN(tags)`

        // NOTE: I'm using double precision here to better map to JavaScript's native Number type.
        await sql`CREATE TABLE pieces (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            owner_id    UUID NOT NULL REFERENCES users,
            layer_id    UUID NOT NULL REFERENCES layers,
            asset_id    UUID NOT NULL REFERENCES assets,
            x           DOUBLE PRECISION NOT NULL DEFAULT 0.0,
            y           DOUBLE PRECISION NOT NULL DEFAULT 0.0,
            z           INT NOT NULL DEFAULT 0,
            rotation    INT NOT NULL DEFAULT 0,
            scale       DOUBLE PRECISION NOT NULL DEFAULT 1.0,
            visible     BOOLEAN NOT NULL DEFAULT TRUE
        )`

        // When we view a scene, we want to get all the pieces attached to the layers within that
        // scene.
        await sql`CREATE INDEX pieces_layer_id_idx ON pieces (layer_id)`

        // NOTE: We do not need an index on owner_id as all pieces are fetched regardless of
        //       owner_id; instead owner_id is used ot help determine who can manipulate the piece.

        process.stdout.write("DONE.\n")
    } catch(e) {
        console.error(e)
    }
}

export async function down() {
    try {
        process.stdout.write("Down... ")

        await sql`SET client_min_messages=WARNING`
        await sql`DROP INDEX IF EXISTS pieces_layer_id_idx`
        await sql`DROP TABLE IF EXISTS pieces`
        await sql`DROP INDEX IF EXISTS assets_tags_idx`
        await sql`DROP INDEX IF EXISTS assets_owner_id_idx`
        await sql`DROP TABLE IF EXISTS assets`
        await sql`DROP INDEX IF EXISTS layers_scene_id_idx`
        await sql`DROP TABLE IF EXISTS layers`
        await sql`DROP INDEX IF EXISTS scenes_game_id_idx`
        await sql`DROP TABLE IF EXISTS scenes`
        await sql`DROP INDEX IF EXISTS game_players_user_id_idx`
        await sql`DROP INDEX IF EXISTS game_players_game_id_idx`
        await sql`DROP TABLE IF EXISTS game_players`
        await sql`DROP TYPE IF EXISTS game_players_role`
        await sql`DROP TABLE IF EXISTS games`
        await sql`DROP TABLE IF EXISTS users`

        process.stdout.write("DONE.\n")
    } catch(e) {
        console.error(e)
    }
}
