const Input = ({
  type = 'text',
  id,
  label,
  help,
  value,
  onChange,
  className = '',
  ...args
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id}>{label}</label>

      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`form-control mt-1 ${help ? 'is-invalid' : ''} ${className}`}
        {...args}
      />

      <small className="form-text text-danger">{help}</small>
    </div>
  );
};

export default Input;
