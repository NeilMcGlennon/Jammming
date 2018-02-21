# Design Document: Track Preview
February 18th 2018

## Objective
Allow for end-users to preview / listen to the music track coming back from search, before they add it to their playlist.

## Background
As users use the Jammming app, they can search for songs and then add them to a playlist.  However in doing this, sometimes there can be several different versions of the same song returned - e.g. a live in concert version, and a studio recorded version.  We would like to implement a way for users to preview the track from the search results or the playlist.

## Technical Design

In the Spotify track web-service which is providing data about each track, there is a value called `preview_url` provided which includes a short snippet of the track.

```
{
  ...
  "href" : "https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp",
  "id" : "3n3Ppam7vgaVa1iaRUc9Lp",
  "name" : "Mr. Brightside",
  "popularity" : 73,
  "preview_url" : "https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba",  // This is the URL we are interested in!
  "track_number" : 2,
  "type" : "track",
  "uri" : "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp"
}
```

In order to implement this, we would modify a couple of components:

In `Spotify.js`, modify the `search()` method to pull the track art.

```
return jsonResponse.tracks.items.map(track => ({
  id: track.id,
  name: track.name,
  artist: track.artists[0].name,
  album: track.album.name,
  art: track.album.images[0].url,  
  preview: track.preview_url,           // Track Preview URL
  uri: track.uri
}));
```

In `Track.js` component, modify the Track `render()` method to include a new React component called `Audio`.  The new `Audio` React component will take two properties: `id` from the `track.id` and `preview` from the `track.preview`.

```
<div className="Track">
  <img className="Track-art" src={this.props.track.art} alt={this.props.track.name} height="50" width="50"/>
  <Audio id={this.props.track.id} preview={this.props.track.preview}/>  // New Audio component
  <div className="Track-information">
    <h3>{this.props.track.name}</h3>
    <p>{this.props.track.artist} | {this.props.track.album}</p>
  </div>
  {this.renderAction()}
</div>
```

In order to implement the `Audio` React component, we'll implement and add `Audio.js` to define the React component, and `Audio.css` for styling.

In the Audio React component, we'll render a div which will show a play / pause button.  

If the `preview` URL is null or empty, then this component will render as disabled.  
_Note: Not all Spotify tracks have a preview URL_

If the `preview` URL is set, then we'll render an enabled play button.  When this play button is pressed, then button will play the preview via an onClick handler to a function called `playAudio`.  If this is playing and pressed again, it will pause the audio and update the buttons appropriately.

To assist in styling the play and pause buttons, we will also leverage styling from [Font Awesome](https://fontawesome.com), so we'll include the FontAwesome React components via NPM.  We'll use a state variable called `playing` which will track if the audio is being played or not, and assist in showing the play or pause button.

## Caveats

Not all Spotify tracks have a preview URL for all markets.  At the moment, there isn't much we can do about that.

This approach uses HTML5 audio components, which older browsers may not support.  This is a calculated decision to only support modern browers.
