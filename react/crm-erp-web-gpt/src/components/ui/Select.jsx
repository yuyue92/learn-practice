import React from 'react';

export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label ? <div className="ui-label mb-1">{label}</div> : null}
      <select className="ui-input" {...props}>{children}</select>
      {error ? <div className="mt-1 text-xs text-danger-700">{error}</div> : null}
    </div>
  );
}
