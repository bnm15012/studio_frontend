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
    email: { type: 'email', required: true },
    phone: { type: 'tel', required: true },
    dob: { type: 'date', required: true },
    emergencyContactNumber: { type: 'tel', required: true },
    address: { type: 'textarea', required: true },
    city: {
      type: 'selection',
      required: true,
      options: [
        ['ahmedabad', 'Ahmedabad'],
        ['mumbai', 'Mumbai'],
        ['delhi', 'Delhi']
      ]
    }
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
