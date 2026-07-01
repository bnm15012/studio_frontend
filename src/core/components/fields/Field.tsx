import React from "react";
import StyledSwitch from "./StyledSwitch";
import DateTime from "./DateTime";
import StyledTextField from "./StyledTextField";
import SelectionField from "./SelectionField";
import { getLocalDateTime } from "../../utils/DateUtil";
import TemplateEditor from "../../../Pages/Management/TemplatesPage/TemplateEditor";
import ImageComponent from "./ImageComponent";
import ImageDialog from "../../crud/ImageDialog";
import StyledCheckbox from "./StyledCheckbox";

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
                return <SelectionField {...(commonProps as any)} getOptions={getOptions as any} />;
            case "BOOL":
                return <StyledSwitch {...(commonProps as any)} />;
            case "DATE":
                return <DateTime {...(commonProps as any)} format="DATE" placeholder={placeholderText} />;
            case "DATETIME":
                return (
                    <DateTime {...(commonProps as any)} format="DATETIME" placeholder={placeholderText} />
                );
            case "EDITOR":
                return (
                    <TemplateEditor {...(commonProps as any)} rows={rows} />
                );
            case "IMAGE_DIALOG":
                return (
                    <ImageDialog
                        image={value as any}
                        setImage={setValueFn}
                        isEdit={true}
                        defaultImage={extraProp?.defaultImage}
                    />
                );
            case "CUSTOM":
                return CustomComponent ? <CustomComponent {...(commonProps as any)} isEdit={true} /> : null;
            case "IMAGE":
                return <ImageComponent allowEdit={isEdit} {...(commonProps as any)} />;
            default:
                return (
                    <StyledTextField
                        {...(commonProps as any)}
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
                return <StyledSwitch {...(commonProps as any)} readOnly={true} />;
            case "CHECK":
                return <StyledCheckbox {...(commonProps as any)} readOnly={true} />;
            case "SELECT":
                return (value as any)?.value;
            case "DATE":
            case "DATETIME":
                return getLocalDateTime(value as any, type);
            case "CUSTOM":
                return CustomComponent ? <CustomComponent {...(commonProps as any)} /> : null;
            case "IMAGE":
                return renderInputField();
            case "IMAGE_DIALOG":
                return <ImageDialog image={value as any} setImage={setValueFn} isEdit={false} />;
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
