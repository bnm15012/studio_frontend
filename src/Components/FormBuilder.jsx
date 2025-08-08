import { useState } from 'react';

const FormBuilder = ({ form }) => {
  const [formState, setFormState] = useState({});

  const handleChange = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
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

export default FormBuilder;
