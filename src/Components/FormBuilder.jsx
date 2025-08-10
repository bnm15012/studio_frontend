import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAlert } from '../utils/Alert';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, TextField, MenuItem, Button, Paper } from '@mui/material';
import DateTimeField from './DateTimeField';

const FormBuilder = ({ form, branchId }) => {
  const FORM_SIG = import.meta.env.VITE_APP_FORM_SIG;
  const [formState, setFormState] = useState({ _form_sig: FORM_SIG });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const showAlert = useAlert();
  const theme = useTheme();

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

    const fieldConfig = form.fields[key];
    if (fieldConfig) {
      const error = validateField(key, value, fieldConfig);
      setErrors(prev => ({ ...prev, [key]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { _form_sig, ...cleanData } = formState;
    if (_form_sig !== FORM_SIG) {
      showAlert('Invalid form signature', 'error');
      return;
    }

    const newErrors = {};
    Object.entries(form.fields).forEach(([key, config]) => {
      const error = validateField(key, formState[key], config);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showAlert('Please fix validation errors before submitting.', 'error');
      return;
    }

    try {
      setLoading(true);
      const { success, message } = await form.onSubmit({
        studentData: { ...cleanData, "branchEntry": { branchId } },
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
      elevation={8}
      sx={{
        maxWidth: 500,
        margin: '40px auto',
        padding: theme.spacing(5),
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 100%)`,
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <Typography
        variant="h4"
        color="primary"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: 1,
          mb: 3,
        }}
      >
        {form.name}
      </Typography>

      <Box
        component="form"
        onClick={() => handleSubmit()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <input
          type="hidden"
          name="_form_sig"
          value={formState._form_sig}
          onChange={(e) => handleChange('_form_sig', e.target.value)}
        />

        {Object.entries(form.fields).map(([key, config]) => {
          const { type, required, options } = config;
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          const error = errors[key];

          if (type === 'text') {
            return (
              <TextField
                size="medium"
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
                sx={{
                  background: theme.palette.background.default,
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1.1rem',
                  },
                }}
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
                sx={{
                  background: theme.palette.background.default,
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              />
            );
          }
          if (type === 'selection') {
            return (
              <TextField
                key={key}
                size="medium"
                select
                label={label}
                required={required}
                value={formState[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                fullWidth
                sx={{
                  background: theme.palette.background.default,
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1.1rem',
                  },
                }}
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
            borderRadius: '16px',
            fontSize: '1.1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
            transition: 'background 0.3s',
            '&:hover': {
              background: `linear-gradient(90deg, ${theme.palette.primary.dark} 60%, ${theme.palette.secondary.dark} 100%)`,
            },
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
  branchId: PropTypes.number,
};

export default FormBuilder;
