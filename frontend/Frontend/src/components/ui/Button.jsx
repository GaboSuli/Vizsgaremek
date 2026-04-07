import React from 'react';
import './Button.css';

/**
 * Unified Button component for Szaldon
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - shows spinner, disables interaction
 * @param {boolean} disabled
 * @param {'button'|'submit'|'reset'} type
 * @param {string} className - extra CSS classes
 * @param {Function} onClick
 * @param {React.ReactNode} children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  children,
  ...rest
}) {
  const classes = [
    'btn-comp',
    `btn-comp--${variant}`,
    `btn-comp--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn-comp__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
