import { useParams } from "react-router-dom";
import FormBuilder from "../../Components/FormBuilder";
import { addStudentAPI } from "../Management/Student/Student.api";
import { useEffect, useMemo } from "react";
import { addEnquiryAPI } from "../../api/enquiry.api";
import { getCurrentDateTimeLocal } from "../../utils/DateUtil";
import { useUI } from "../../context/UIContext";


const FormFillPage = () => {
    const { formId, branchId } = useParams();
    const { isEnabled, FEATURE_KEYS } = useUI();
    const formData = useMemo(() => [
        {
            id: "student-form",
            name: "Student Registration Form",
            onSubmit: addStudentAPI,
            fields: [
                { name: "name", section: "Basic Info", label: "Name", validation: { required: true } },
                {
                    name: "email",
                    label: "Email",
                    type: "email",
                    section: "Basic Info",
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
                    section: "Basic Info",
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
                    section: "Basic Info",
                    validation: {
                        required: true,
                    },
                    extraProp: {
                        includeCurrentTime: false,
                    },
                },
                {
                    name: "emergencyContactNumber",
                    type: "number",
                    section: "Basic Info",
                    label: "Emergency Contact",
                    validation: {
                        required: true,
                        regex: /^\d{10}$/,
                        message: "Please enter a valid emergency contact number",
                    },
                },
                {
                    name: "address",
                    section: "Basic Info",
                    label: "Address",
                    validation: {
                        required: true,
                    },
                },
                ...(isEnabled(FEATURE_KEYS.ENROLMENT) ?
                    [{ name: "parentName", section: "Parent Info", label: "Parent Name", validation: { required: true } },
                    { name: "parentPhone", section: "Parent Info", label: "Parent Phone", validation: { required: true } },
                    { name: "parentAddress", section: "Parent Info", label: "Parent Address", validation: { required: true } },
                    { name: "parentRelation", section: "Parent Info", label: "Parent Relation", validation: { required: true } },
                    { name: "anyPastExperience", section: "Other Info", label: "Any Past Experience" },
                    { name: "whereYouHereAboutUs", section: "Other Info", label: "How You Heard About Us" },
                    { name: "hobbiesInterests", section: "Other Info", label: "Hobbies Interests" },
                    { name: "medicalInfo", section: "Medical Info", label: "Please give details of any medical condition which you feel school should be aware of." }]
                    : [])
                ,
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
                    defaultValue: getCurrentDateTimeLocal(),
                },
            ],
        },
    ], [branchId]);

    useEffect(() => { }, [formId]);

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
