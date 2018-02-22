const clientId = '9065bc7bd26c4095a4175c6336b40705';
const redirectUri = 'http://localhost:3000/';

let accessToken;

const Spotify = {

  getAccessToken() {

    //console.log ( `Getting access token from Spotify...`);

    const responseType = 'token';
    const scope = 'playlist-modify-public';

    if (accessToken) {
      //console.log ( `Using existing token.`);
      return accessToken;
    }

    const returnedToken = window.location.href.match(/access_token=([^&]*)/);
    const returnedExpiration = window.location.href.match(/expires_in=([^&]*)/);

    if (returnedToken && returnedExpiration) {

      accessToken = returnedToken[1];
      const expiresIn = Number(returnedExpiration[1]);

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      //console.log ( `Token retreived [${accessToken}]`);

      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(clientId)}&response_type=${encodeURIComponent(responseType)}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }
  },

  search(term) {

    //console.log ( `Searching Spotify with args: term[${term}]`);

    accessToken = Spotify.getAccessToken();

    const type = 'track';

    return fetch(`https://api.spotify.com/v1/search?type=${type}&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          art: track.album.images[0].url,
          preview: track.preview_url,
          uri: track.uri
        }));
      } else {
        return [];
      }
    });
  },

  savePlaylist(playlistName, trackURIs) {

    //console.log ( `Saving playlist to Spotfy with args: playlistName[${playlistName}] trackURIs[${trackURIs}]`);

    if (!(playlistName || trackURIs)) {
      return;
    }

    accessToken = Spotify.getAccessToken();

    return fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      const userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        method: 'POST',
        body: JSON.stringify({
          name: playlistName
        })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          method: 'POST',
          body: JSON.stringify({
            uris: trackURIs
          })
        })
      });
    });
  }
};

export default Spotify;
