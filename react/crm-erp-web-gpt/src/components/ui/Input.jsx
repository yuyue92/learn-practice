import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label ? <div className="ui-label mb-1">{label}</div> : null}
      <input className="ui-input" {...props} />
      {error ? <div className="mt-1 text-xs text-danger-700">{error}</div> : null}
    </div>
  );
}
