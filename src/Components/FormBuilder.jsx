import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAlert } from '../utils/Alert';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, TextField, MenuItem, Button, Paper } from '@mui/material';
import DateTimeField from './DateTimeField';

const FormBuilder = ({ form }) => {
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});  // To track field validation errors
  const [loading, setLoading] = useState(false);
  const showAlert = useAlert();
  const theme = useTheme();

  // Load signature and public key from env
  const FORM_SIG = import.meta.env.VITE_APP_FORM_SIG;

  const validateField = (key, value, config) => {
    if (config.required && !value) {
      return 'This field is required';
    }
    if (config.validation?.regex) {
      const regex = new RegExp(config.validation.regex);
      if (!regex.test(value)) {
        return config.validation.errorMessage || 'Invalid format';
      }
    }
    return null;
  };

  const handleChange = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));

    // Validate as user types
    const fieldConfig = form.fields[key];
    const error = validateField(key, value, fieldConfig);
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const newErrors = {};
    Object.entries(form.fields).forEach(([key, config]) => {
      const error = validateField(key, formState[key], config);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // If any errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      showAlert('Please fix validation errors before submitting.', 'error');
      return;
    }

    try {
      setLoading(true);
      const { success, message } = await form.onSubmit({
        studentData: formState,
        formSignature: FORM_SIG,
      });

      if (success) {
        showAlert(message, 'success');
      } else {
        showAlert(message, 'error');
      }
    } catch (error) {
      console.error(error);
      showAlert('Failed to save/update student', 'error');
    }
    setLoading(false);
  };

  return (
    <Paper
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h4" color="primary" gutterBottom>
        {form.name}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        {Object.entries(form.fields).map(([key, config]) => {
          const { type, required, options } = config;
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const error = errors[key];

          if (type === 'text') {
            return (
              <TextField
                size="small"
                key={key}
                label={label}
                type={type}
                variant="outlined"
                required={required}
                value={formState[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                error={!!error}
                helperText={error}
                fullWidth
              />
            );
          }

          if (type === 'date') {
            return (
              <DateTimeField
                onChange={(e) => handleChange(key, e)}
                value={formState[key]}
                placeholder="Date of birth"
                format="DATE"
                key={key}
                textFieldVarient="outlined"
              />
            );
          }
          if (type === 'selection') {
            return (
              <TextField
                key={key}
                size="small"
                select
                label={label}
                required={required}
                value={formState[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                fullWidth
              >
                <MenuItem value="">Select...</MenuItem>
                {options.map(([val, label]) => (
                  <MenuItem key={val} value={val}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          return null;
        })}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            padding: theme.spacing(1.5),
            fontWeight: 'bold',
            borderRadius: theme.shape.borderRadius,
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Paper>
  );
};

FormBuilder.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }).isRequired,
};

export default FormBuilder;
