import React from 'react';

export function UserItem({ user }) {
    return (
        <li className="khala-useritem">
            <span className="khala-useritem-avatar">
                <img src={`/image/avatar/avatar0${user.avatar}.jpg`} alt="" />
            </span>
            <p className="khala-useritem-name">{user.nickname}</p>
        </li>
    )
}