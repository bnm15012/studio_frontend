import React from "react";
import { TextField } from "@mui/material";
import { FlexEvenlyColumn } from "@/core/components/layout/FlexBox";

interface FormFieldsValues {
    studioName?: string;
    userName?: string;
    email?: string;
    password?: string;
    contactDetails?: string;
    location?: string;
    address?: string;
    state?: string;
    pincode?: string;
}

interface FormFieldsProps {
    onChangehandle: (val: string, key: string) => void;
    values: FormFieldsValues;
    isRegister: boolean;
    isLogin: boolean;
}

const FormFields: React.FC<FormFieldsProps> = ({ onChangehandle, values, isRegister, isLogin }) => (
    <>
        <FlexEvenlyColumn>
            {isRegister && (
                <>
                    <TextField
                        variant="standard"
                        required
                        label="Studio Name"
                        onChange={(e) => onChangehandle(e.target.value, "studioName")}
                        value={values.studioName || ""}
                        sx={{ width: "100%" }}
                    />
                    <TextField
                        variant="standard"
                        required
                        label="User Name"
                        onChange={(e) => onChangehandle(e.target.value, "userName")}
                        value={values.userName || ""}
                        sx={{ width: "100%" }}
                    />
                </>
            )}
            <TextField
                variant="standard"
                required
                type={isRegister ? "email" : "text"}
                label={isLogin ? "Username" : "Email"}
                onChange={(e) =>
                    isLogin
                        ? onChangehandle(e.target.value, "userName")
                        : onChangehandle(e.target.value, "email")
                }
                value={values.email || ""}
                sx={{ width: "100%" }}
            />
            {isLogin && (
                <TextField
                    variant="standard"
                    required
                    type={"password"}
                    label={"password"}
                    onChange={(e) => onChangehandle(e.target.value, "password")}
                    value={values.password || ""}
                    sx={{ width: "100%" }}
                />
            )}
            {isRegister && (
                <>
                    <TextField
                        variant="standard"
                        required
                        label="Phone"
                        onInput={(e: React.FormEvent<HTMLDivElement>) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/[^0-9]/g, "").slice(0, 10);
                        }}
                        onChange={(e) => onChangehandle(e.target.value, "contactDetails")}
                        value={values.contactDetails || ""}
                        sx={{ width: "100%" }}
                        slotProps={{
                            htmlInput: {
                                maxLength: 10,
                            },
                            input: {
                                pattern: "[0-9]*",
                                inputMode: "numeric",
                            } as any,
                        }}
                    />
                    <TextField
                        variant="standard"
                        required
                        label="City"
                        onChange={(e) => onChangehandle(e.target.value, "location")}
                        value={values.location || ""}
                        sx={{ width: "100%" }}
                    />
                    <TextField
                        variant="standard"
                        required
                        label="Address"
                        onChange={(e) => onChangehandle(e.target.value, "address")}
                        value={values.address || ""}
                        sx={{ width: "100%" }}
                    />
                    <TextField
                        variant="standard"
                        required
                        label="State"
                        onChange={(e) => onChangehandle(e.target.value, "state")}
                        value={values.state || ""}
                        sx={{ width: "100%" }}
                    />
                    <TextField
                        variant="standard"
                        required
                        label="Pincode"
                        onChange={(e) => onChangehandle(e.target.value, "pincode")}
                        value={values.pincode || ""}
                        sx={{ width: "100%" }}
                        slotProps={{
                            htmlInput: {
                                maxLength: 6,
                            },
                        }}
                    />
                </>
            )}
        </FlexEvenlyColumn>
    </>
);

export default FormFields;
