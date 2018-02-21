import React from 'react';
import './Track.css';

class Track extends React.Component {

  constructor(props){
    super(props);

    // Method bindings
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }

  renderAction(){
    if ( this.props.isRemoval ) {
      return <a className="Track-action" onClick={this.removeTrack}>-</a>
    } else {
      return <a className="Track-action" onClick={this.addTrack}>+</a>
    }
  }

  addTrack() {
    this.props.onAdd( this.props.track );
  }

  removeTrack() {
    this.props.onRemove( this.props.track );
  }

  render() {
    return (
      <div className="Track">
        <img className="Track-art" src={this.props.track.art} alt={this.props.track.name} height="50" width="50"/>
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
