'use strict';

function UserArea() {
  return (
    <div className="khala-userarea">
      <div className="khala-userarea-header">
        <span className="khala-user-number"></span>
      </div>
    </div>
  )
}

function KhalaChatRoom() {
  return (
      <>
        <UserArea />
      </>
    );
}

ReactDOM.render(
    <>
      <KhalaChatRoom />
    </>,
    document.getElementById('khala-room-container')
);