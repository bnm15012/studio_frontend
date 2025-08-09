import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAlert } from '../utils/Alert';

const FormBuilder = ({ form }) => {
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false)
  
  const showAlert = useAlert();


  const handleChange = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data, success, message } = await form.onSubmit({
        studentData: formState,
        token,
      });
      if (success) {
        showAlert(message, "success");
      } else {
        showAlert(message, "error");
      }

    } catch (error) {
      console.error(error);
      showAlert("Failed to save/update student", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{form.name}</h2>

      {Object.entries(form.fields).map(([key, config]) => {
        const { type, required, options } = config;

        return (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label>
              {key.charAt(0).toUpperCase() + key.slice(1)}{required && ' *'}:
              {type === 'text' && (
                <input
                  type="text"
                  required={required}
                  value={formState[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
              {type === 'date' && (
                <input
                  type="date"
                  required={required}
                  value={formState[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
              {type === 'selection' && (
                <select
                  required={required}
                  value={formState[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  <option value="">Select...</option>
                  {options.map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </label>
          </div>
        );
      })}

      <button type="submit">Submit</button>
    </form>
  );
};

FormBuilder.propTypes = {
  form: { name: PropTypes.string.isRequired, fields: PropTypes.object.isRequired, onSubmit: PropTypes.func.isRequired}
}
export default FormBuilder;
