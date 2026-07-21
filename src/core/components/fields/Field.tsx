/** Master field renderer that dispatches to the correct input component (Switch, DateTime, TextField, Select, Checkbox, Image, Editor, Custom) based on field type. */
import React, { Suspense } from "react";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { ExtraProp } from "@/core/types";
import { SelectionFieldProps } from "@/core/components/fields/SelectionField";
import { StyledSwitchProps } from "@/core/components/fields/StyledSwitch";
import { DateTimeProps } from "@/core/components/fields/DateTime";
import { StyledTextFieldProps } from "@/core/components/fields/StyledTextField";
import { ImageComponentProps } from "@/core/components/fields/ImageComponent";
import { StyledCheckboxProps } from "@/core/components/fields/StyledCheckbox";
import { EditorInputBoxProps } from "@/core/components/fields/TemplateEditor";

import StyledSwitch from "@/core/components/fields/StyledSwitch";
import DateTime from "@/core/components/fields/DateTime";
import StyledTextField from "@/core/components/fields/StyledTextField";
import SelectionField from "@/core/components/fields/SelectionField";
import EditorInputBox from "@/core/components/fields/EditorInputBox";
import ImageComponent from "@/core/components/fields/ImageComponent";
import ImageDialog from "@/core/crud/ImageDialog";
import StyledCheckbox from "@/core/components/fields/StyledCheckbox";

interface FieldProps<FT, T> {
    value?: FT;
    setValue?: (val: FT) => void;
    isEdit?: boolean;
    placeholder?: string;
    label?: string;
    type?: string;
    validation?: Record<string, unknown>;
    extraProp?: ExtraProp<T>;
    submitAttempted?: boolean;
}

const Field = <FT, T>({
    value,
    setValue,
    isEdit = true,
    placeholder = "",
    label = "",
    type = "text",
    validation = {},
    extraProp = {},
    submitAttempted,
}: FieldProps<FT, T>) => {
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
                if (!getOptions) {
                    throw new Error("SELECT field requires getOptions");
                }

                return (
                    <SelectionField<T>
                        {...(commonProps as unknown as SelectionFieldProps<T>)}
                        getOptions={getOptions}
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
                        setImage={(val) => setValueFn(val as FT)}
                        isEdit={true}
                        defaultImage={extraProp.defaultImage}
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
                return (value as { value?: React.ReactNode } | null | undefined)?.value;
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
                        setImage={(val) => setValueFn(val as FT)}
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
