# Design Document: Enter on Search
February 18th 2018

## Objective
Improve usability by allowing Jamming end-users to click 'Enter' on search.

## Background
Overall, as a Jammming end-user, I would like to hit the 'Enter' key on the search input box instead of having to type a value in, and then click the enter button with a mouse.  This allows me to search for things much faster and intuitively, while keeping things on the keyboard.

## Technical Design

In order to implement this, this would require a few small changes to the `SearchBar.js` file.

First, we'll need to create an event handler, `handleKeyPress` which will listen for an 'enter' key press.  When the 'enter' key (key 13) is detected, we'll call the search handler.

```
handleKeyPress( event ) {
  if ( ( event.which || event.keyCode ) === 13 ) {
    this.props.onSearch( this.state.term );
  }
}
```

Second, we'll add this event handler to an `onKeyPress` on the existing search `input` element, as follows:

```
<div className="SearchBar">
  <input placeholder="Enter A Song, Album, or Artist"
    onChange={this.handleTermChange}
    onKeyPress={this.handleKeyPress}/>   // Added onKeyPress event listener
  <a onClick={this.search}>SEARCH</a>
</div>
```

Last, we'll want to bind this to the SearchBar constructor

```
this.handleKeyPress   = this.handleKeyPress.bind( this );
```

Overall, this should be a fairly simple change.

## Caveats

There could be other ways to handle this as well, which we've decided against.  

Another approach would be to utilize [JQuery](https://jquery.com) JavaScript libraries to look for the specific 'Enter' keypress.

To implement this, in `SearchBar.js`, you would add an id to the anchor tag as follows:

```
<a id="searchButton" onClick={this.search}>SEARCH</a>
```

And then you would need to add in additional JavaScript JQuery listeners to the `index.html` page in order to listen for a keypress event on the 'Enter' key (key number 13) and then initiate a call to `onClick()` as if it were clicked.  This code might look as follows:

```
$('#searchButton').keypress( function( e ) {  // Look for key-press event, bound on the searchButton.
    if ( ( e.which || e.keyCode ) === 13 )    // Look to see if the key-press was an Enter (13)
        $('#searchButton').click();           // Initiate a click, which uses the React onClick={this.search}
});
```

This introduces some complexity and additional libraries (JQuery) in order to achieve this.  This may also not be as cross-browser compatible.
