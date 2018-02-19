import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    // Method bindings
    this.addTrack           = this.addTrack.bind(this);
    this.removeTrack        = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist       = this.savePlaylist.bind(this);
    this.search             = this.search.bind(this);

    // State
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    Spotify.getAccessToken();
  }

  addTrack( track ) {
    let playlistTracks = this.state.playlistTracks;
    if( playlistTracks.find( playlistTrack => playlistTrack.id === track.id ) ) {
      return;
    }
    playlistTracks.push( track );
    this.setState({ playlistTracks: playlistTracks });
  }

  removeTrack( track ) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName( name ) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    console.log( "Saving playlist..." );

    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });

    Spotify.savePlaylist( this.state.playlistName, trackURIs );

    this.setState({
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search( term ) {
    console.log( `Searching Spotify with term[${term}]` );
    Spotify.search(term).then(results => {
  		this.setState({
  			searchResults: results
  		});
  	});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
