import { useParams } from 'react-router-dom';
import FormBuilder from '../../Components/FormBuilder';


const mockFormData = {
  id: 'form123',
  name: 'User Information Form',
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

const FormPage = () => {
  const { formId } = useParams();

  const formData = mockFormData;

  return <FormBuilder form={formData} />;
};

export default FormPage;
