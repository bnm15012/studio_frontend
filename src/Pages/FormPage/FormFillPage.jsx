import { useParams } from 'react-router-dom';
import FormBuilder from '../../Components/FormBuilder';
import { addStudentAPI } from '../Management/Student/Student.api';
import { useEffect } from 'react';
import { addEnquiryAPI } from '../Management/Enquiry/enquiry.api';
import { getCurrentDateTimeUTC } from '../../utils/DateUtil';

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
        regex: /^\d{10}$/,
        errorMessage: "Please enter a valid 10-digit phone number",
      }
    },
    dob: { type: 'date', required: true },
    emergencyContactNumber: {
      type: 'text',
      required: true,
      validation: {
        regex: /^\d{10,12}$/,
        errorMessage: "Please enter a valid emergency contact number",
      }
    },
    address: { type: 'text', required: true },
  }
},
{
  id: 'enquiry-form',
  name: 'Enquiry Form',
  onSubmit: addEnquiryAPI,
  fields: {
    name: { type: 'text', required: true },
    contact: {
      type: 'text',
      required: true,
      validation: {
        regex: /^\d{10}$/,
        errorMessage: "Please enter a valid contact number",
      }
    },
    enquiryPurpose: { type: 'text', required: true },
    enquiryDate: { type: 'date', required: true, defaultValue: getCurrentDateTimeUTC(), readOnly: true }
  }
}];

const FormFillPage = () => {
  const { formId, branchId } = useParams();

  useEffect(() => {

  }, [
    formId,
  ])

  const form = formData.filter(fd => fd.id === formId)[0];
  return <>{form?.length !== 0 ? <FormBuilder form={form} branchId={branchId} /> : <div>Form not found</div>
  }</>
};

export default FormFillPage;
