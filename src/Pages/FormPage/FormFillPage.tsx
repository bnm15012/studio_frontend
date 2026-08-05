import { useParams } from "react-router-dom";
import FormBuilder from "@/core/components/forms/FormBuilder";
import { addStudentAPI } from "@/Pages/Management/Student/Student.api";
import { useEffect, useMemo } from "react";
import { addEnquiryAPI } from "@/api/enquiry.api";
import { getCurrentDateTimeLocal } from "@/core/utils/DateUtil";
import type { FieldDef } from "@/core/types";

import type { Student, Enquiry } from "@/api/types";
interface FormDefinition {
    id: string;
    name: string;
    onSubmit: (arg: {
        newData: Partial<Student> | Partial<Enquiry>;
        formSignature: string;
    }) => Promise<{ success: boolean; message: string }>;
    fields: FieldDef[];
}

const FormFillPage = () => {
    const { formId, branchId } = useParams();
    const formData: FormDefinition[] = useMemo(
        () => [
            {
                id: "student-form",
                name: "Student Registration Form",
                onSubmit: async ({ newData }) => {
                    const res = await addStudentAPI({
                        newData: newData as Partial<Student>,
                        token: null,
                    });
                    return { success: res.success, message: res.message || "" };
                },
                fields: [
                    {
                        name: "name",
                        section: "Basic Info",
                        label: "Name",
                        validation: { required: true },
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "EMAIL",
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
                        type: "NUMBER",
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
                        type: "NUMBER",
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
                    {
                        show: false,
                        section: "Basic Info",
                        name: "gender",
                        label: "Gender",
                        type: "SELECT",
                        validation: { required: true },
                        getValue: (value) => ({ key: String(value), value }),
                        defaultValue: "MALE",
                        getOptions: async (search: string, page: number, limit: number) =>
                            ["MALE", "FEMALE", "NOT_TO_SAY"]
                                .filter((a) => a.toLowerCase().includes(search.toLowerCase()))
                                .slice((page - 1) * limit, page * limit)
                                .map((a) => ({ key: a, value: a })),
                    },
                    // ...(permissions.ENROLMENT ?
                    //     [{ name: "parentName", section: "Parent Info", label: "Parent Name", validation: { required: true } },
                    //     { name: "parentPhone", section: "Parent Info", label: "Parent Phone", validation: { required: true } },
                    //     { name: "parentAddress", section: "Parent Info", label: "Parent Address", validation: { required: true } },
                    //     { name: "parentRelation", section: "Parent Info", label: "Parent Relation", validation: { required: true } },
                    //     { name: "anyPastExperience", section: "Other Info", label: "Any Past Experience" },
                    //     { name: "whereYouHereAboutUs", section: "Other Info", label: "How You Heard About Us" },
                    //     { name: "hobbiesInterests", section: "Other Info", label: "Hobbies Interests" },
                    //     { name: "medicalInfo", section: "Medical Info", label: "Please give details of any medical condition which you feel school should be aware of." }]
                    //     : [])
                    // ,
                ],
            },
            {
                id: "enquiry-form",
                name: "Enquiry Form",
                onSubmit: async ({ newData }) => {
                    const res = await addEnquiryAPI({
                        newData: newData as Partial<Enquiry>,
                        token: "",
                    });
                    return { success: res.success, message: res.message || "" };
                },
                fields: [
                    {
                        name: "enquiryPurpose",
                        label: "Enquiry Purpose",
                        validation: { required: true },
                    },
                    { name: "name", label: "Name", validation: { required: true } },
                    {
                        name: "contact",
                        label: "Phone Number",
                        type: "NUMBER",
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
        ],
        [],
    );

    useEffect(() => {}, [formId]);

    const form: FormDefinition | undefined = formData.find((fd) => fd.id === formId);
    return (
        <>
            {form ? (
                <FormBuilder form={form} branchId={branchId ?? ""} />
            ) : (
                <div>Form not found</div>
            )}
        </>
    );
};

export default FormFillPage;
