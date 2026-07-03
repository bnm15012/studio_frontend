import React from "react";
import StyledSwitch, { type StyledSwitchProps } from "./StyledSwitch";
import DateTime, { type DateTimeProps } from "./DateTime";
import StyledTextField, { type StyledTextFieldProps } from "./StyledTextField";
import SelectionField, { type SelectionFieldProps } from "./SelectionField";
import { getLocalDateTime } from "../../utils/DateUtil";
import TemplateEditor, { type TemplateEditorProps } from "../../../Pages/Management/TemplatesPage/TemplateEditor";
import ImageComponent, { type ImageComponentProps } from "./ImageComponent";
import ImageDialog from "../../crud/ImageDialog";
import StyledCheckbox, { type StyledCheckboxProps } from "./StyledCheckbox";
import { SelectOption } from "../../types";

interface ExtraProp {
    min?: string | number;
    max?: string | number;
    rows?: number;
    getOptions?: (search: string, page: number, limit: number) => Promise<SelectOption[]>;
    readOnly?: boolean;
    CustomComponent?: React.ComponentType<Record<string, unknown>>;
    defaultImage?: string;
    [key: string]: unknown;
}

interface FieldProps {
    value?: unknown;
    setValue?: (val: unknown) => void;
    isEdit?: boolean;
    placeholder?: string;
    label?: string;
    type?: string;
    validation?: Record<string, unknown>;
    extraProp?: ExtraProp;
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
        ...extraProp,
    };

    const renderInputField = (): React.ReactNode => {
        const placeholderText = placeholder || label;

        switch (type) {
            case "SELECT":
                return <SelectionField {...(commonProps as unknown as SelectionFieldProps)} getOptions={getOptions as (search: string, offset: number, limit: number) => Promise<SelectOption[]>} />;
            case "BOOL":
                return <StyledSwitch {...(commonProps as unknown as StyledSwitchProps)} />;
            case "DATE":
                return <DateTime {...(commonProps as unknown as DateTimeProps)} format="DATE" placeholder={placeholderText} />;
            case "DATETIME":
                return (
                    <DateTime {...(commonProps as unknown as DateTimeProps)} format="DATETIME" placeholder={placeholderText} />
                );
            case "EDITOR":
                return (
                    <TemplateEditor {...(commonProps as unknown as TemplateEditorProps)} rows={rows} />
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
                return <ImageComponent allowEdit={isEdit} {...(commonProps as unknown as ImageComponentProps)} />;
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
                return <StyledSwitch {...(commonProps as unknown as StyledSwitchProps)} readOnly={true} />;
            case "CHECK":
                return <StyledCheckbox {...(commonProps as unknown as StyledCheckboxProps)} readOnly={true} />;
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
                return <ImageDialog image={value as string | null | undefined} setImage={setValueFn} isEdit={false} />;
            default:
                return (value as React.ReactNode) || "N/A";
        }
    };

    if (isEdit && (readOnly === false || readOnly == null)) {
        return renderInputField();
    }

    return getValue();
};

export default Field;
