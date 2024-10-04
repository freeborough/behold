BEHOLD: REQUIREMENTS
====================

## Overview

Behold is a Virtual Tabletop (VTT) service that lets players create games and invite other players to join them on a shared virtual tabletop that updates in realtime.

## Non-Functional

* NF01: Players will be able to use the system from their browser on desktop, tablet, and mobile.

## Functional

### Players

Players are the people that play the games together.

* PLF01: Players will need to create an account and sign in to use the system - their email address shall be their username.

* PLF02: If a player has forgotten their password, they can request for it to be reset and sent an email.

* PLF03: A player can have a display name, which is the name that's displayed to other users by default rather than their email address which will always remain private.

### Games

A game is a specific virtual tabletop that a group of players are playing on together.

* GAF01: Players can create games, which have a name and a description.

* GAF02: For a specific game, players can be assigned the role of "Game Master" (GM) which can grant them additional priviledges.

* GAF03: The player that created the game will be its "owner" and by default assigned to the role of GM.

* GAF04: Players can invite other players to join a game.

* GAF05: Players get to see a list of their games, both that they own and they're joined to.

* GAF06: Games are made-up of one or more Scenes.  When a game is first created, an Unamed empty scene is created for it.

* GAF07: When a player first connects to a game, its entire state is sent to them.

### Scenes

A scene is essentially its own virtual tabletop upon which a game is played.  Some games, particularly Tabletop Roleplaying Games (TTRPGs) require many scenes, whereas others, like most board games, require just one.

* SCF01: A scene has a name and can only belong to one game.

* SCF02: A scene can be "visible" or "hidden".  When visible, all players can see the scene.  When hidden, only players with the GM role can see them.

* SCF03: Scenes are composed of a number of Layers which are ordered and are rendered in order.  By default they have a "background" and "foreground" layer.

* SCF04: GMs can create new scenes and change their visibility.

* SCF05: Players can navigate a scene by panning and zooming.

* SCF06: GMs will be provided with a "Scene Tree" that shows all the Layers and Pieces in a tree-like structure such that they can easily manage them.

### Layers

Layers are used to organise Pieces such that they're drawn in the correct order, for example always ensuring that a game board is below the pieces.

* LAF01: A layer has a name.

* LAF02: A layer can contain any number of Pieces, which it will render.

* LAF03: Players can create new layers.

* LAF04: Players can rename layers.

* LAF05: Players can move Pieces from one layer to another.

* LAF06: A layer can be "locked" such that it's not possible to modify it without first unlocking it.

### Pieces

Pieces are the digital representation of physical objects, like tokens, characters, effects, and more.

* PIF01: A piece has a position: x, y.

* PIF02: A piece has a rotation, from 0 to 360 degrees, defaulting to 0.  Players will be able to rotate the piece.

* PIF03: A piece is an instance of an Asset, and therefore will have a reference to an Asset.

* PIF04: A piece also has a z postion, to determine the order its rendered in within its layer.

* PIF05: Pieces can only belong in one layer.

* PIF06: Pieces can be selected and moved, if in a layer that is not locked.

* PIF07: Pieces can be added to a Scene Layer from the Asset Library.

* PIF08: Pieces can be removed from a Scene Layer.

* PIF09: A piece has a scale which can be used to alter its size.

* PIF10: Multiple pieces can be selected at once.  Any actions, for example movement, will be applied to all selected pieces simultaneously.

* PIF11: All changes to pieces within a Scene Layer, including but not limited to creating, removing, moving, and scaling, will be synchronised between all of the games connected players in realtime.

* PIF12: A Piece can have any number of child Pieces.  A child Piece's position and z is relative to its parent Piece.  A child piece must be within the same scene, but does not necessarily have to be within the same layer.

### Assets

Assets are what pieces are made from - they can be maps, tokens, effect templates, and more - though to start with we'll just support images.

* ASF01: An asset has a name.

* ASF02: An Image asset can be created by uploading an image or passing in a URL of an image.

* ASF03: Assets can be tagged with text-based tags, e.g. "Image", "Map", "Character", "Monster".

* ASF04: There are different kinds of assets, therefore an asset will have a "kind" that indicates which.  Where possible, this will be automatically determined.

* ASF05: Assets can be associated with a specific Game, but are not limited to just one game.

* ASF06: An asset browser needs to be provided that lets players select Assets to be brought into their Scenes as Pieces.

* ASF07: The asset browser will let Players search their assets by name and tags.


## Future Considerations

* FC01: Support for localisation should be baked in.  While we'll only support English initially, it should be minimal effort to add other languages/localisations.

* FC02: While Assets and therefore Pieces will just be images for now, we'll want to support other types of Assets and Pieces in the future, including but not limited to: text, characters, sound, light, interactive elements, and more.
