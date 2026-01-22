import React,{useState} from 'react';
import PropTypes from 'prop-types';

const InputPassword = ({ field }) => {
  const { name, label, value, onChange, required, error, placeholder, readOnly, tooltip, characterLimit,actionClicked  } = field;
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (password) => {
    if (password.length >= 8) {
      return 'Strong';
    } else if (password.length >= 4) {
      return 'Medium';
    } else {
      return 'Weak';
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    onChange(newPassword);
    const strength = checkPasswordStrength(newPassword);
    setPasswordStrength(strength);
  };
  return (
    <div className='form-group my-2'>
          {label && (
        <label htmlFor={name} style={{ width: `${25}%` }}>
          {label}
          <span className="required_mark"> {required ? ` *` : null}</span>
        </label>
      )}
      <div className='w-75 d-inline-block mx-2'>
        <input
          type='password'
          id={name}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          required={required}
          className='form-control rounded-2'
          placeholder={placeholder}
          readOnly={readOnly}
          title={tooltip}
          maxLength={characterLimit } 
        />
          <div>{passwordStrength}</div>
        {error && actionClicked && <p className='text-danger'>{error}</p>}
      </div>
    </div>
  );
};

InputPassword.propTypes = {
  field: PropTypes.object.isRequired,
};

export default InputPassword;
