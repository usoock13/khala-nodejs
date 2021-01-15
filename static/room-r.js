
function khalaChatRoom() {
  
    render() 
      return (
          <button onClick={() => this.setState({ liked: true })}>
            Like
          </button>
        );
    }

ReactDOM.render(
    khalaChatRoom,
    document.getElementById('khala-room-container')
);