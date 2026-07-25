/**
 * Type-level tests for the FieldDef framework.
 * These are NOT executed at runtime — they are purely compile-time checks.
 *
 * PASSING tests: code that should compile without errors.
 * FAILING tests: code annotated with @ts-expect-error that should produce TS errors.
 *
 * Run: npx tsc --noEmit to verify all tests pass.
 */
import React from "react";
import { FieldDef, defineField, SelectExtraProp, ImageExtraProp } from "@/core/types";
import type { Student, Expense, genderType, expenseCategory } from "@/api/types";

// ─────────────────────────────────────────────────────────────────────────────
// Helper to suppress "unused variable" errors
// ─────────────────────────────────────────────────────────────────────────────
declare function use<T>(_: T): void;

// ─────────────────────────────────────────────────────────────────────────────
// Section 1: satisfies FieldDef<T>[] — the primary API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Test 1.1 — SELECT field: extraProp.getOptions is required.
 * `satisfies` provides contextual type, so `value` in getValue should be genderType.
 */
const validSelectField = [
    {
        name: "gender",
        label: "Gender",
        type: "SELECT" as const,
        extraProp: {
            getOptions: async (_search: string, _page: number, _limit: number) =>
                ["MALE", "FEMALE", "NOT_TO_SAY"].map((v) => ({
                    key: v,
                    value: v as string | number,
                })),
        },
        getValue: (value: genderType) => ({ key: value, value }),
        defaultValue: "MALE" as genderType,
    },
] satisfies FieldDef<Student>[];
use(validSelectField);

/**
 * Test 1.2 — TEXT field (no type specified = default).
 * getValue should accept Student["name"] = string.
 */
const validTextField = [
    {
        name: "name",
        label: "Name",
        validation: { required: true },
    },
] satisfies FieldDef<Student>[];
use(validTextField);

/**
 * Test 1.3 — NUMBER field.
 * getValue receives Student["age"] = number | undefined.
 * extraProp allows readOnly, min, max.
 */
const validNumberField = [
    {
        name: "age",
        label: "Age",
        type: "NUMBER" as const,
        extraProp: { readOnly: true, min: 0, max: 150 },
        getValue: (_value: number | undefined, row: Student) => {
            if (!row.dob) return null;
            return new Date().getFullYear() - new Date(String(row.dob)).getFullYear();
        },
    },
] satisfies FieldDef<Student>[];
use(validNumberField);

/**
 * Test 1.4 — IMAGE field with size extraProp.
 */
const validImageField = [
    {
        name: "imageUrl",
        label: "Image",
        type: "IMAGE" as const,
        extraProp: { size: "30px" },
    },
] satisfies FieldDef<Student>[];
use(validImageField);

/**
 * Test 1.5 — DATE field.
 */
const validDateField = [
    {
        name: "dob",
        label: "Date of Birth",
        type: "DATE" as const,
        extraProp: { includeCurrentTime: false },
    },
] satisfies FieldDef<Student>[];
use(validDateField);

/**
 * Test 1.6 — BOOL field.
 */
const validBoolField = [
    {
        name: "isActive",
        label: "Active",
        type: "BOOL" as const,
        defaultValue: true,
    },
] satisfies FieldDef<{ isActive: boolean; [key: string]: unknown }>[];
use(validBoolField);

/**
 * Test 1.7 — Mixed field array with multiple types.
 */
const validMixedFields = [
    { name: "name", label: "Name", validation: { required: true } },
    { name: "age", label: "Age", type: "NUMBER" as const, extraProp: { readOnly: true } },
    {
        name: "gender",
        label: "Gender",
        type: "SELECT" as const,
        extraProp: {
            getOptions: async () => [],
        },
    },
    { name: "dob", label: "DOB", type: "DATE" as const },
    { name: "imageUrl", label: "Image", type: "IMAGE" as const },
] satisfies FieldDef<Student>[];
use(validMixedFields);

/**
 * Test 1.8 — SELECT on Expense with expenseCategory.
 */
const validExpenseField = [
    {
        name: "expenseCategory",
        label: "Category",
        type: "SELECT" as const,
        extraProp: {
            getOptions: async () => [],
        },
        getValue: (value: expenseCategory) => ({ key: value, value }),
        defaultValue: "ELECTRICITY" as expenseCategory,
    },
] satisfies FieldDef<Expense>[];
use(validExpenseField);

// ─────────────────────────────────────────────────────────────────────────────
// Section 2: defineField<T>() — escape hatch for explicit K inference
// ─────────────────────────────────────────────────────────────────────────────

const f = defineField<Student>();

/**
 * Test 2.1 — defineField gives exact type inference for getValue.
 */
const genderFieldDefined = f({
    name: "gender",
    label: "Gender",
    type: "SELECT",
    extraProp: {
        getOptions: async () => [],
    },
});
use(genderFieldDefined);

/**
 * Test 2.2 — defineField with NUMBER type.
 */
const ageFieldDefined = f({
    name: "age",
    label: "Age",
    type: "NUMBER",
    extraProp: { readOnly: true },
});
use(ageFieldDefined);

// ─────────────────────────────────────────────────────────────────────────────
// Section 3: Compile-time ERRORS — these must NOT compile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Test 3.1 — SELECT without getOptions in extraProp → ERROR.
 */
const _invalidSelectNoGetOptions = [
    // @ts-expect-error: extraProp.getOptions is required for SELECT
    {
        name: "gender",
        label: "Gender",
        type: "SELECT",
        extraProp: {},
    },
] satisfies FieldDef<Student>[];
use(_invalidSelectNoGetOptions);

/**
 * Test 3.2 — SELECT without extraProp at all → ERROR.
 */
const _invalidSelectNoExtraProp = [
    // @ts-expect-error: extraProp is required for SELECT
    {
        name: "gender",
        label: "Gender",
        type: "SELECT",
    },
] satisfies FieldDef<Student>[];
use(_invalidSelectNoExtraProp);

/**
 * Test 3.3 — IMAGE with getOptions → ERROR (getOptions not valid for IMAGE).
 */
const _invalidImageWithGetOptions = [
    {
        name: "imageUrl",
        label: "Image",
        type: "IMAGE",
        extraProp: {
            // @ts-expect-error: getOptions is not a valid property of ImageExtraProp
            getOptions: async () => [],
        },
    },
] satisfies FieldDef<Student>[];
use(_invalidImageWithGetOptions);

/**
 * Test 3.4 — DATE with size extraProp → ERROR (size not valid for DATE).
 */
const _invalidDateWithSize = [
    {
        name: "dob",
        label: "DOB",
        type: "DATE",
        extraProp: {
            // @ts-expect-error: size is not a valid property of DateExtraProp
            size: "30px",
        },
    },
] satisfies FieldDef<Student>[];
use(_invalidDateWithSize);

/**
 * Test 3.5 — NUMBER with getOptions → ERROR.
 */
const _invalidNumberWithGetOptions = [
    {
        name: "age",
        label: "Age",
        type: "NUMBER",
        extraProp: {
            // @ts-expect-error: getOptions is not valid for NUMBER
            getOptions: async () => [],
        },
    },
] satisfies FieldDef<Student>[];
use(_invalidNumberWithGetOptions);

// ─────────────────────────────────────────────────────────────────────────────
// Section 4: ExtraProp shape type assertions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Test 4.1 — SelectExtraProp: getOptions must be a function.
 */
const validSelectExtraProp: SelectExtraProp<Student> = {
    getOptions: async () => [],
    readOnly: false,
    variant: "standard",
};
use(validSelectExtraProp);

/**
 * Test 4.2 — ImageExtraProp: only size and defaultImage allowed.
 */
const validImageExtraProp: ImageExtraProp = {
    size: "50px",
    defaultImage: "/placeholder.png",
};
use(validImageExtraProp);

/**
 * Test 4.3 — ImageExtraProp: getOptions is NOT allowed.
 */
const _invalidImageExtraProp: ImageExtraProp = {
    // @ts-expect-error: getOptions is not assignable to ImageExtraProp
    getOptions: async () => [],
};
use(_invalidImageExtraProp);

// ─────────────────────────────────────────────────────────────────────────────
// Section 5: Loose field (nested path — no K inference, should compile)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Test 5.1 — Nested path field should compile (no type inference, but no error).
 */
const validNestedPathField = [
    {
        name: "paymentEntry.paymentDate",
        label: "Payment Date",
        type: "DATE" as const,
        defaultValue: "2024-01-01",
    },
] satisfies FieldDef<{ paymentEntry: { paymentDate: string }; [key: string]: unknown }>[];
use(validNestedPathField);

// ─────────────────────────────────────────────────────────────────────────────
// Section 6: getValue return types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Test 6.1 — SELECT getValue returns { key, value } pair (not ReactNode).
 */
const _selectGetValueTest = [
    {
        name: "gender",
        label: "Gender",
        type: "SELECT" as const,
        extraProp: { getOptions: async () => [] },
        getValue: (value: genderType) => ({ key: value, value }),
    },
] satisfies FieldDef<Student>[];
use(_selectGetValueTest);

/**
 * Test 6.2 — Non-SELECT getValue can return ReactNode.
 */
const _textGetValueTest = [
    {
        name: "membershipStatus",
        label: "Status",
        getValue: (value: string) =>
            React.createElement("span", { style: { color: "green" } }, value),
    },
] satisfies FieldDef<Student>[];
use(_textGetValueTest);

export {};
