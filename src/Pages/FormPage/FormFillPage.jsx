import { useParams } from 'react-router-dom';
import FormBuilder from '../../Components/FormBuilder';
import { addStudentAPI } from '../Management/Student/Student.api';
import { useEffect } from 'react';


const formData = [{
  id: 'student-form',
  name: 'Student Registration Form',
  onSubmit: addStudentAPI,
  fields: {
    name: { type: 'text', required: true },
    email: { 
      type: 'text', 
      required: true,
      validation: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: "Please enter a valid email address",
      }
    },
    phone: { 
      type: 'text', 
      required: true,
      validation: {
        // Example: 10-digit phone number, digits only
        regex: /^\d{10}$/,
        errorMessage: "Please enter a valid 10-digit phone number",
      }
    },
    dob: { type: 'date', required: true },
    emergencyContactNumber: { 
      type: 'text', 
      required: true,
      validation: {
        // Allow digits, 10-12 length, or customize as needed
        regex: /^\d{10,12}$/,
        errorMessage: "Please enter a valid emergency contact number",
      }
    },
    address: { type: 'text', required: true },
  }
}];

const FormFillPage = () => {
  const { formId } = useParams();

  useEffect(() => {

  }, [
    formId,
  ])

  const form = formData.filter(fd => fd.id === formId)[0];
  return <>{form?.length !== 0 ? <FormBuilder form={form} /> : <div>Form not found</div>
  }</>
};

export default FormFillPage;
