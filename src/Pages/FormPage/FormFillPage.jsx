import { useParams } from 'react-router-dom';
import FormBuilder from '../../Components/FormBuilder';
import { addStudentAPI } from '../Management/Student/Student.api';


const mockFormData = {
  id: 'student-form',
  name: 'User Information Form',
  onSubmit: addStudentAPI,
  fields: {
    name: { type: 'text', required: true },
    dob: { type: 'date', required: true },
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
};

const FormFillPage = () => {
  const { formId } = useParams();

  const formData = mockFormData;

  return <FormBuilder form={formData} />;
};

export default FormFillPage;
