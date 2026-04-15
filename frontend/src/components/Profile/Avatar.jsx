import React from 'react';
import './Avatar.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

function isValidImage(url) {
  return url && typeof url === 'string' && url !== 'user.png' && url.trim() !== '';
}

export default function Avatar({ src, name, size = 'md', className = '', onClick, style }) {
  const initials = getInitials(name);
  const hasImage = isValidImage(src);

  const cls = [
    'avatar',
    `avatar--${size}`,
    hasImage ? 'avatar--img' : 'avatar--initials',
    onClick ? 'avatar--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} onClick={onClick} style={style} title={name || ''}>
      {hasImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="avatar__img"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span
        className="avatar__initials"
        style={hasImage ? { display: 'none' } : undefined}
      >
        {initials}
      </span>
    </div>
  );
}
