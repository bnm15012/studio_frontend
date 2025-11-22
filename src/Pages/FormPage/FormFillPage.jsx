import { useParams } from "react-router-dom";
import FormBuilder from "../../Components/FormBuilder";
import { addStudentAPI } from "../Management/Student/Student.api";
import { useEffect } from "react";
import { addEnquiryAPI } from "../../api/enquiry.api";
import { getCurrentDateTimeUTC } from "../../utils/DateUtil";

const formData = [
    {
        id: "student-form",
        name: "Student Registration Form",
        onSubmit: addStudentAPI,
        fields: [
            { name: "name", label: "Name", validation: { required: true } },
            {
                name: "email",
                label: "Email",
                type: "email",
                validation: {
                    required: true,
                    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                },
            },
            {
                name: "phone",
                label: "Phone Number",
                type: "number",
                validation: {
                    required: true,
                    regex: /^\d{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                },
            },
            {
                name: "dob",
                type: "DATE",
                label: "Date of Birth",
                validation: {
                    required: true,
                },
            },
            {
                name: "emergencyContactNumber",
                type: "number",
                validation: {
                    required: true,
                    regex: /^\d{10,12}$/,
                    message: "Please enter a valid emergency contact number",
                },
            },
            {
                name: "address",
                label: "Address",
                validation: {
                    required: true,
                },
            },
        ],
    },
    {
        id: "enquiry-form",
        name: "Enquiry Form",
        onSubmit: addEnquiryAPI,
        fields: [
            { name: "enquiryPurpose", label: "Enquiry Purpose", validation: { required: true } },
            { name: "name", label: "Name", validation: { required: true } },
            {
                name: "contact",
                label: "Phone Number",
                type: "number",
                validation: {
                    required: true,
                    regex: /^\d{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                },
            },
            {
                name: "enquiryDate",
                type: "DATE",
                label: "Date of Enquiry",
                validation: {
                    required: true,
                },
                extraProp: {
                    readOnly: true,
                },
                defaultValue: getCurrentDateTimeUTC(),
            },
        ],
    },
];

const FormFillPage = () => {
    const { formId, branchId } = useParams();

    useEffect(() => {}, [formId]);

    const form = formData.filter((fd) => fd.id === formId)[0];
    return (
        <>
            {form?.length !== 0 ? (
                <FormBuilder form={form} branchId={branchId} />
            ) : (
                <div>Form not found</div>
            )}
        </>
    );
};

export default FormFillPage;
