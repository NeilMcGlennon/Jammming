# Design Document: Track Album Art
February 18th 2018

## Objective
Provide a small icon of the track's album art to help the end user recognize tracks they may be interested in.

## Background
As an end user, I would like to visually see the track art which is being conveyed, in order to easier identify the track which was searched for.

## Technical Design

In the track web-service which is providing data about each track, there is data provided already which indicates icons for an album:

```
{
  "album" : {
    "id" : "4OHNH3sDzIxnmUADXzv2kT",
    "images" : [ {
      "height" : 640,
      "url" : "https://i.scdn.co/image/ac68a9e4a867ec3ce8249cd90a2d7c73755fb487",
      "width" : 629
    }, {
      "height" : 300,
      "url" : "https://i.scdn.co/image/d0186ad64df7d6fc5f65c20c7d16f4279ffeb815",
      "width" : 295
    }, {
      "height" : 64,
      "url" : "https://i.scdn.co/image/7c3ec33d478f5f517eeb5339c2f75f150e4d601e",
      "width" : 63
    } ],
    ...
  },
  ...
  "type" : "track",
  "uri" : "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"
}
```
In order to get this to work, we would modify a couple of components:

In `Spotify.js`, modify the `search()` method to pull the track art.

```
return jsonResponse.tracks.items.map(track => ({
  id: track.id,
  name: track.name,
  artist: track.artists[0].name,
  album: track.album.name,
  art: track.album.images[0].url,  // New album art
  uri: track.uri
}));
```

Since there can be several images, we'll simply use the first one we see.

In `Track.js` component, modify the Track `render()` method to include a new image HTML component, which will reference the new `this.props.track.art` pulled from the web-service.

```
<div className="Track">
  <img className="Track-art" src={this.props.track.art} alt={this.props.track.name} height="50" width="50"/>  // New image added
  <div className="Track-information">
    <h3>{this.props.track.name}</h3>
    <p>{this.props.track.artist} | {this.props.track.album}</p>
  </div>
  {this.renderAction()}
</div>
```
Here, since track art sizes can vary, and we want our images to look consistent, we'll default to using a height and width of 50 pixels.

In `Track.css`, we'll add a new `Track-art` class as follows, for formatting:

```
.Track-art {
  margin-right:10px;
}
```

## Caveats

None - this should be very straight-forward.
