import React from 'react';

const styles = {
  primary: 'ui-btn-primary',
  ghost: 'ui-btn-ghost',
  danger: 'ui-btn-danger'
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={`${styles[variant]} ${className}`} {...props} />;
}
