/**
 * 通用文本域组件
 */

function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`input ${error ? 'border-danger-500' : ''} resize-none`}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default Textarea;
