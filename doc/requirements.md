BEHOLD: REQUIREMENTS
====================

## Overview

Behold is a Virtual Tabletop (VTT) service that lets players create games and invite other players
to join them on a shared virtual tabletop that updates in realtime.

## Non-Functional

* NF1: Players will be able to use the system from their browser on desktop, tablet, and mobile.

## Functional

### Players

Players are the people that play the games together.

* PLF1: Players will need to create an account and sign in to use the system - their email address
  shall be their username.

* PLF2: If a player has forgotten their password, they can request for it to be reset and sent an
  email.

* PLF3: A player can have a display name, which is the name that's displayed to other users by
  default rather than their email address which will always remain private.

### Games

A game is a specific virtual tabletop that a group of players are playing on together.

* GAF1: Players can create games, which have a name and optionally a description.

* GAF2: For a specific game, players can be assigned the role of "Game Master" (GM) which can grant
  them additional priviledges.

* GAF3: The player that created the game will be its "owner" and by default assigned to the role of
  GM.

* GAF4: Players can invite other players to join a game.

* GAF5: Players get to see a list of their games, both that they own and they're joined to.

* GAF6: Games are made-up of one or more Scenes.  When a game is first created, an Unamed empty
  scene is created for it.

* GAF7: When a player first connects to a game, its entire state is sent to them.

### Scenes

A scene is essentially its own virtual tabletop upon which a game is played.  Some games,
particularly Tabletop Roleplaying Games (TTRPGs) require many scenes, whereas others, like most
board games, require just one.

* SCF1: A scene has a name and can only belong to one game.

* SCF2: A scene can be "visible" or "hidden".  When visible, all players can see the scene.  When
  hidden, only players with the GM role can see them.

* SCF3: Scenes are composed of a number of Layers which are ordered and are rendered in order.  By
  default they have a "background" and "foreground" layer.

* SCF4: GMs can create new scenes and change their visibility.

* SCF5: Players can navigate a scene by panning and zooming.

* SCF6: GMs will be provided with a "Scene Tree" that shows all the Layers and Pieces in a
  tree-like structure such that they can easily manage them.

### Layers

Layers are used to organise Pieces such that they're drawn in the correct order, for example always
ensuring that a game board is below the pieces.

* LAF1: A layer has a name.

* LAF2: A layer can contain any number of Pieces, which it will render.

* LAF3: GM Players can create new layers.

* LAF4: GM Players can rename layers.

* LAF5: GM Players can move Pieces from one layer to another.

### Pieces

Pieces are the digital representation of physical objects, like tokens, characters, effects, and
more.

* PIF1: A piece has a position: x, y.

* PIF2: A piece has a rotation, from 0 to 360 degrees, defaulting to 0.  Players will be able to
  rotate the piece.

* PIF3: A piece is an instance of an Asset, and therefore will have a reference to an Asset.

* PIF4: A piece also has a z index, to determine the order its rendered in within its layer.

* PIF5: Pieces can only belong in one layer.

* PIF6: Pieces can be selected and moved, if in a layer that is not locked.

* PIF7: Pieces can be added to a Scene Layer from the Asset Library.

* PIF8: Pieces can be removed from a Scene Layer.

* PIF9: A piece has a scale which can be used to alter its size.

* PIF10: A piece has a hidden boolean property that indicates if it is hidden from non-GM Players.

* PIF11: Multiple pieces can be selected at once.  Any actions, for example movement, will be
  applied to all selected pieces simultaneously.

* PIF12: All changes to pieces within a Scene Layer, including but not limited to creating,
  removing, moving, and scaling, will be synchronised between all of the games connected players in
  realtime.

* PIF13: If a Piece's Asset is deleted, it will instead switch to being a "Default" version of that
  type of Asset.

* PIF14: A piece has an owner Player, which defaults to the Player that created it.  By default only
  the owner of a Piece and Players with the GM role can manipulate it.

### Assets

Assets are what pieces are made from - they can be maps, tokens, effect templates, and more - though
to start with we'll just support images.

* ASF1: An asset has a name.

* ASF2: An Image asset can be created by uploading an image or passing in a URL of an image.

* ASF3: Assets can be tagged with text-based tags, e.g. "Image", "Map", "Character", "Monster".

* ASF4: There are different kinds of assets, therefore an asset will have a "kind" that indicates
  which.  Where possible, this will be automatically determined.

* ASF5: Assets can be associated with a specific Game, but are not limited to just one game.

* ASF6: An asset browser needs to be provided that lets players select Assets to be brought into
  their Scenes as Pieces.

* ASF7: The asset browser will let Players search their assets by name, tags, and game.

* ASF8: Assets will be owned by a Player and by default only they will have visibility of and
  access to their assets.

* ASF9: Each player will have a, server-configurable, storage limit for their assets.  They will be
  unable to upload assets if they do not have sufficient storage.

* ASF10: Players will be able to delete their assets.  If the asset is currently in use by a Piece
  in a Game, they will be informed of which games their assets are being used in and asked to
  confirm.

* ASF11: When an Asset is added to a Game, it will be synchronised with all connected GM Players and
  be available to be served to all Players.

## Future Considerations

* FC1: Support for localisation should be baked in.  While we'll only support English initially, it
  should be minimal effort to add other languages/localisations.

* FC2: While Assets and therefore Pieces will just be images for now, we'll want to support other
  types of Assets and Pieces in the future, including but not limited to: text, characters, sound,
  light, interactive elements, and more.

* FC3: In the future we'll want to allow Piece owners and GM Players to be able to assign
  permission to manipulate pieces to one or more Players.