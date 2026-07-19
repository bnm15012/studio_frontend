/** Master field renderer that dispatches to the correct input component (Switch, DateTime, TextField, Select, Checkbox, Image, Editor, Custom) based on field type. */
import React, { lazy, Suspense } from "react";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { SelectOption, ExtraProp } from "@/core/types";
import { SelectionFieldProps } from "@/core/components/fields/SelectionField";
import { StyledSwitchProps } from "@/core/components/fields/StyledSwitch";
import { DateTimeProps } from "@/core/components/fields/DateTime";
import { StyledTextFieldProps } from "@/core/components/fields/StyledTextField";
import { ImageComponentProps } from "@/core/components/fields/ImageComponent";
import { StyledCheckboxProps } from "@/core/components/fields/StyledCheckbox";
import { EditorInputBoxProps } from "@/core/components/fields/TemplateEditor";

const StyledSwitch = lazy(() => import("@/core/components/fields/StyledSwitch"));
const DateTime = lazy(() => import("@/core/components/fields/DateTime"));
const StyledTextField = lazy(() => import("@/core/components/fields/StyledTextField"));
const SelectionField = lazy(() => import("@/core/components/fields/SelectionField"));
const EditorInputBox = lazy(() => import("@/core/components/fields/EditorInputBox"));
const ImageComponent = lazy(() => import("@/core/components/fields/ImageComponent"));
const ImageDialog = lazy(() => import("@/core/crud/ImageDialog"));
const StyledCheckbox = lazy(() => import("@/core/components/fields/StyledCheckbox"));

interface FieldProps {
    value?: unknown;
    setValue?: (val: unknown) => void;
    isEdit?: boolean;
    placeholder?: string;
    label?: string;
    type?: string;
    validation?: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extraProp?: ExtraProp<any>;
    submitAttempted?: boolean;
}

const Field: React.FC<FieldProps> = ({
    value,
    setValue,
    isEdit = true,
    placeholder = "",
    label = "",
    type = "text",
    validation = {},
    extraProp = {},
    submitAttempted,
}) => {
    const { min, max, rows, getOptions, readOnly, CustomComponent } = extraProp;
    const setValueFn = setValue ?? (() => {});
    const commonProps = {
        value,
        minVal: min,
        maxVal: max,
        setValue: setValueFn,
        label,
        validation,
        submitAttempted,
        ...extraProp,
    };

    const renderInputField = (): React.ReactNode => {
        const placeholderText = placeholder || label;

        switch (type) {
            case "SELECT":
                return (
                    <SelectionField
                        {...(commonProps as unknown as SelectionFieldProps)}
                        getOptions={
                            getOptions as (
                                search: string,
                                offset: number,
                                limit: number,
                            ) => Promise<SelectOption[]>
                        }
                    />
                );
            case "BOOL":
                return <StyledSwitch {...(commonProps as unknown as StyledSwitchProps)} />;
            case "DATE":
                return (
                    <DateTime
                        {...(commonProps as unknown as DateTimeProps)}
                        format="DATE"
                        placeholder={placeholderText}
                    />
                );
            case "DATETIME":
                return (
                    <DateTime
                        {...(commonProps as unknown as DateTimeProps)}
                        format="DATETIME"
                        placeholder={placeholderText}
                    />
                );
            case "EDITOR":
                return (
                    <EditorInputBox
                        {...(commonProps as unknown as EditorInputBoxProps)}
                        rows={rows}
                    />
                );
            case "IMAGE_DIALOG":
                return (
                    <ImageDialog
                        image={value as string | null | undefined}
                        setImage={setValueFn}
                        isEdit={true}
                        defaultImage={extraProp?.defaultImage}
                    />
                );
            case "CUSTOM":
                return CustomComponent ? <CustomComponent {...commonProps} isEdit={true} /> : null;
            case "IMAGE":
                return (
                    <ImageComponent
                        allowEdit={isEdit}
                        {...(commonProps as unknown as ImageComponentProps)}
                    />
                );
            default:
                return (
                    <StyledTextField
                        {...(commonProps as unknown as StyledTextFieldProps)}
                        rows={rows}
                        placeholder={placeholderText}
                        type={type}
                    />
                );
        }
    };

    const getValue = (): React.ReactNode => {
        switch (type) {
            case "BOOL":
                return (
                    <StyledSwitch
                        {...(commonProps as unknown as StyledSwitchProps)}
                        readOnly={true}
                    />
                );
            case "CHECK":
                return (
                    <StyledCheckbox
                        {...(commonProps as unknown as StyledCheckboxProps)}
                        readOnly={true}
                    />
                );
            case "SELECT":
                return (value as SelectOption | null)?.value;
            case "DATE":
            case "DATETIME":
                return getLocalDateTime(value as string | null | undefined, type);
            case "CUSTOM":
                return CustomComponent ? <CustomComponent {...commonProps} /> : null;
            case "IMAGE":
                return renderInputField();
            case "IMAGE_DIALOG":
                return (
                    <ImageDialog
                        image={value as string | null | undefined}
                        setImage={setValueFn}
                        isEdit={false}
                    />
                );
            default:
                return (value as React.ReactNode) || "N/A";
        }
    };

    return (
        <Suspense fallback={null}>
            {isEdit && (readOnly === false || readOnly == null) ? renderInputField() : getValue()}
        </Suspense>
    );
};

export default Field;
