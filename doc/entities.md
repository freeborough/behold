BEHOLD VTT: ENTITIES
====================

![Entity Relationship Diagram](./images/erd.drawio.svg)

## User

| Field    | Type   | Tags   | Comments
| -------- | ------ | -------| --------
| id       | uuid   | pk     | 
| username | text   | unique | Users login with their email address.
| salt     | text   |        | Generated salt used to hash the password.
| password | text   |        | Password hashed using the salt and original plain text password.

## Game

| Field       | Type    | Tags     | Comments
| ----------- | ------- | -------- | --------
| id          | uuid    | pk       | 
| name        | text    |          | The name of the game, visible to all users with read access to the game.
| description | text    | optional | Optional short description of the game.
| owner_id    | uuid    | fk       | The user that created and therefore owns the game. References User.id.
| slug        | text    | unique   | Unique identifier of the game that can be used in URLs.

## GamePlayer

| Field         | Type    | Tags     | Comments
| ------------- | ------- | -------- | --------
| id            | uuid    | pk       | 
| game_id       | uuid    | fk       | A game the user belongs to.  References Game.id.
| user_id       | uuid    | fk       | A user that is a player of the game.  References User.id.
| role          | enum    |          | The role that the user has in the game: [gm, player].

## Scene

| Field       | Type    | Tags     | Comments
| ----------- | ------- | -------- | --------
| id          | uuid    | pk       | 
| game_id     | uuid    | fk       | The game that this scene belongs to.
| name        | text    |          | The name of the scene, visible to everyone with read access.
| visible     | boolean |          | Indicates whether the Scene is visible to users with the Player role or not. Defaults to false.

## Layer

| Field       | Type    | Tags     | Comments
| ----------- | ------- | -------- | --------
| id          | uuid    | pk       | 
| scene_id    | uuid    | fk       | The scene that this layer belongs to.
| name        | text    |          | The name of the layer, as visible in the scene tree.

## Asset

| Field       | Type    | Tags     | Comments
| ----------- | ------- | -------- | --------
| id          | uuid    | pk       | 
| name        | text    |          | The name of the asset.
| owner_id    | uuid    | fk       | The user that created the asset, and is therefore the owner.
| url         | text    |          | URL that points to the asset's data (either externally or locally).
| tags        | text[]  |          | List of tags that are associated with this asset.

## GameAsset

| Field       | Type    | Tags     | Comments
| ----------- | ------- | -------- | --------
| id          | uuid    | pk       | 
| game_id     | uuid    | fk       | The game the asset is associated with.
| asset_id    | uuid    | fk       | The asset that is associated with a game.

## Piece

| Field       | Type    | Tags     | Comments
| ----------- | ------- | -------- | --------
| id          | uuid    | pk       | 
| owner_id    | uuid    | fk       | The user that created, and therefore owns, the piece.
| layer_id    | uuid    | fk       | The layer that this piece belongs to.
| asset_id    | uuid    | fk       | The asset that this piece is an instance of.
| x           | real    |          | The x position of the peice within its layer.  Defaults to 0.0.
| y           | real    |          | The y position of the piece within its layer.  Defaults to 0.0.
| z           | int     |          | The z-index of the piece within its layer.  Defaults to 0.
| rotation    | int     |          | The rotation of the piece.  Default to 0.
| scale       | real    |          | The scale of the piece from its original asset size.  Defaults to 1.0.
| visible     | boolean |          | Whether users with the player role can see this piece.  Defaults to true.