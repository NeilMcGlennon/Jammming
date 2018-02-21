import React from 'react';
import './Audio.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/fontawesome-free-solid'

class Track extends React.Component {

  constructor( props ) {
    super(props);

    // Method bindings
    this.playAudio = this.playAudio.bind(this);

    // State
    this.state = {
      playing: false,
      disabled: this.props.preview == null
    };
  }

  playAudio() {
    var audio = document.getElementById( this.props.id );
    if ( audio.paused ) {
      this.setState({ playing: true }, function () {
        audio.play();
      });
    } else {
      this.setState({ playing: false }, function () {
        audio.pause();
      });
    }
  }

  render() {
    return (
      <div className="Audio">
        <audio id={this.props.id} >
          <source src={this.props.preview} type="audio/mp3"/>
        </audio>
        <button
          disabled={this.state.disabled}
          onClick={this.playAudio}>
          <FontAwesomeIcon icon={ this.state.playing ? faPause : faPlay }/>
        </button>
      </div>
    );
  }
}

export default Track;
