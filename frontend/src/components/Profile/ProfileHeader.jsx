import React from 'react';
import Avatar from './Avatar.jsx';
import './ProfileHeader.css';

export default function ProfileHeader({ user }) {
  if (!user) return null;

  const name = user.nev || 'Felhasználó';
  const email = user.email || '';
  const nickname = user.becenev;
  const level = user.jogosultsag_szint ?? 0;

  const roleText =
    level === 255 ? 'Adminisztrátor' : level > 0 ? 'Moderátor' : 'Felhasználó';
  const roleCls =
    level === 255 ? 'ph-role--admin' : level > 0 ? 'ph-role--mod' : 'ph-role--user';

  return (
    <div className="profile-header">
      <div className="profile-header__bg" />
      <div className="profile-header__content">
        <Avatar
          src={user.profilkep_url}
          name={name}
          size="xl"
          className="profile-header__avatar"
        />
        <div className="profile-header__info">
          <h1 className="profile-header__name">{name}</h1>
          {nickname && (
            <span className="profile-header__nickname">@{nickname}</span>
          )}
          <p className="profile-header__email">{email}</p>
        </div>
        <span className={`profile-header__role ${roleCls}`}>{roleText}</span>
      </div>
    </div>
  );
}
