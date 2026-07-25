/** Master field renderer that dispatches to the correct input component (Switch, DateTime, TextField, Select, Checkbox, Image, Editor, Custom) based on field type. */
import React, { Suspense } from "react";
import { getLocalDateTime } from "@/core/utils/DateUtil";
import { ExtraProp, SelectOption, GenericItem } from "@/core/types";

import StyledSwitch from "@/core/components/fields/StyledSwitch";
import DateTime from "@/core/components/fields/DateTime";
import StyledTextField, { ValidationRules } from "@/core/components/fields/StyledTextField";
import SelectionField from "@/core/components/fields/SelectionField";
import EditorInputBox from "@/core/components/fields/EditorInputBox";
import ImageComponent from "@/core/components/fields/ImageComponent";
import ImageDialog from "@/core/crud/ImageDialog";
import StyledCheckbox from "@/core/components/fields/StyledCheckbox";

export interface FieldProps<FT, T = GenericItem> {
    value?: FT;
    setValue?: (val: FT) => void;
    isEdit?: boolean;
    placeholder?: string;
    label?: string;
    type?: string;
    validation?: ValidationRules;
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
    const setValueFn = (val: unknown) => setValue?.(val as FT);

    const renderInputField = (): React.ReactNode => {
        const placeholderText = placeholder || label;

        switch (type) {
            case "SELECT":
                return (
                    <SelectionField<T>
                        label={label}
                        value={(value as SelectOption<T> | null) ?? null}
                        readOnly={readOnly}
                        setValue={setValueFn}
                        getOptions={getOptions!}
                        variant={extraProp.variant ?? "standard"}
                        validation={validation}
                        saveType={extraProp.saveType ?? "string"}
                    />
                );
            case "BOOL":
                return (
                    <StyledSwitch
                        label={label}
                        readOnly={readOnly}
                        value={Boolean(value)}
                        setValue={setValueFn}
                    />
                );
            case "DATE":
                return (
                    <DateTime
                        value={typeof value === "string" ? value : null}
                        label={label}
                        setValue={setValueFn}
                        minVal={typeof min === "string" ? min : undefined}
                        maxVal={typeof max === "string" ? max : undefined}
                        readOnly={readOnly}
                        format="DATE"
                        variant={extraProp.variant ?? "standard"}
                        includeCurrentTime={extraProp.includeCurrentTime}
                        placeholder={placeholderText}
                    />
                );
            case "DATETIME":
                return (
                    <DateTime
                        value={typeof value === "string" ? value : null}
                        label={label}
                        setValue={setValueFn}
                        minVal={typeof min === "string" ? min : undefined}
                        maxVal={typeof max === "string" ? max : undefined}
                        readOnly={readOnly}
                        format="DATETIME"
                        variant={extraProp.variant ?? "standard"}
                        includeCurrentTime={extraProp.includeCurrentTime}
                        placeholder={placeholderText}
                    />
                );
            case "EDITOR":
                return (
                    <EditorInputBox
                        value={String(value ?? "")}
                        setValue={setValueFn}
                        variables={extraProp.variables}
                        rows={rows}
                        label={label}
                        disableVars={extraProp.disableVars}
                    />
                );
            case "IMAGE_DIALOG":
                return (
                    <ImageDialog
                        image={typeof value === "string" ? value : null}
                        setImage={setValueFn}
                        isEdit={true}
                        defaultImage={extraProp.defaultImage}
                    />
                );
            case "CUSTOM":
                return CustomComponent ? (
                    <CustomComponent
                        value={value}
                        setValue={setValueFn}
                        label={label}
                        isEdit={true}
                        {...extraProp}
                    />
                ) : null;
            case "IMAGE":
                return (
                    <ImageComponent
                        allowEdit={isEdit}
                        value={typeof value === "string" ? value : undefined}
                        setValue={setValueFn}
                        size={extraProp.size != null ? String(extraProp.size) : undefined}
                    />
                );
            default:
                return (
                    <StyledTextField
                        value={value == null ? "" : String(value)}
                        setValue={setValueFn}
                        rows={rows}
                        label={label}
                        placeholder={placeholderText}
                        type={type}
                        variant={extraProp.variant ?? "standard"}
                        validation={validation}
                        readOnly={readOnly}
                        submitAttempted={submitAttempted}
                    />
                );
        }
    };

    const getValue = (): React.ReactNode => {
        switch (type) {
            case "BOOL":
                return (
                    <StyledSwitch
                        label={label}
                        readOnly={true}
                        value={Boolean(value)}
                        setValue={() => {}}
                    />
                );
            case "CHECK":
                return (
                    <StyledCheckbox
                        label={label}
                        readOnly={true}
                        value={Boolean(value)}
                        setValue={() => {}}
                    />
                );
            case "SELECT":
                return value && typeof value === "object" && "value" in value
                    ? (value as { value: React.ReactNode }).value
                    : null;
            case "DATE":
            case "DATETIME":
                return getLocalDateTime(typeof value === "string" ? value : null, type);
            case "CUSTOM":
                return CustomComponent ? (
                    <CustomComponent
                        value={value}
                        setValue={setValueFn}
                        label={label}
                        isEdit={false}
                        {...extraProp}
                    />
                ) : null;
            case "IMAGE":
                return renderInputField();
            case "IMAGE_DIALOG":
                return (
                    <ImageDialog
                        image={typeof value === "string" ? value : null}
                        setImage={setValueFn}
                        isEdit={false}
                    />
                );
            default:
                return typeof value === "string" ||
                    typeof value === "number" ||
                    React.isValidElement(value)
                    ? (value as React.ReactNode)
                    : "N/A";
        }
    };

    return (
        <Suspense fallback={null}>
            {isEdit && (readOnly === false || readOnly == null) ? renderInputField() : getValue()}
        </Suspense>
    );
};

export default Field;
