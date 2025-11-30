import {
    TableBody,
    TableHead,
    Paper,
    IconButton,
    Button,
    Pagination,
    Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "../StyledTableComponents";
import Field from "../Fields/Field";
import PropTypes from "prop-types";
import { getNestedValue } from "../../utils/objectHelpers";
import FlexEvenly from "../FlexEvenly";
import { memo, useCallback } from "react";
import FlexBetween from "../FlexBetween";
import Actions from "./helper/Actions";

const ListView = ({
    fields,
    data,
    editingId,
    fieldsMeta,
    actions,
    handleChange,
    handleSave,
    loading,
    handleCancel,
    tableState,
    handlePageChange,
    handleViewOpen,
}) => {
    const isEdit = (row, field) =>
        editingId === row[fieldsMeta.primary] && (field?.editable ? field.editable(row) : true);
    const onClickRow = useCallback(
        (row) => actions.find((a) => a.name === "form" && !a.hide).onClick(row),
        [actions],
    );

    return (
        <>
            <StyledTableContainer component={Paper}>
                <StyledTable>
                    <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                        <StyledTableRow>
                            <StyledTableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                S. No.
                            </StyledTableCell>
                            {fields
                                .filter((f) => f.show || f.view)
                                .map(({ label }) => (
                                    <StyledTableCell
                                        key={label}
                                        sx={{ fontWeight: "bold", color: "#1976d2" }}
                                    >
                                        {label}
                                    </StyledTableCell>
                                ))}
                            <StyledTableCell
                                sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                            >
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <StyledTableRow
                                key={row[fieldsMeta.primary]}
                                sx={{ cursor: onClickRow ? "pointer" : "auto" }}
                                onClick={() => onClickRow(row)}
                            >
                                <StyledTableCell>
                                    {(parseInt(tableState.currentPage) - 1) * tableState.pageSize +
                                        rowIndex +
                                        1}
                                </StyledTableCell>
                                {fields
                                    .filter((f) => f.show || f.view)
                                    .map((field) => (
                                        <StyledTableCell key={field.name}>
                                            {field.view ? (
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewOpen(row);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            ) : (
                                                <Field
                                                    isEdit={isEdit(row, field)}
                                                    value={
                                                        field?.getValue
                                                            ? field.getValue(
                                                                  getNestedValue(row, field.name),
                                                                  row,
                                                                  isEdit(row, field),
                                                              )
                                                            : getNestedValue(row, field.name)
                                                    }
                                                    setValue={(v) => {
                                                        handleChange(
                                                            v,
                                                            row[fieldsMeta.primary],
                                                            field.name,
                                                        );
                                                    }}
                                                    type={field.type}
                                                    extraProp={{
                                                        ...field.extraProp,
                                                        getOptions: async (search, page, limit) =>
                                                            field.extraProp.getOptions(
                                                                search,
                                                                page,
                                                                limit,
                                                                row,
                                                            ),
                                                    }}
                                                    validation={field.validation}
                                                />
                                            )}
                                        </StyledTableCell>
                                    ))}

                                <StyledTableCell>
                                    <FlexEvenly>
                                        {editingId === row[fieldsMeta.primary] ? (
                                            <>
                                                <IconButton
                                                    onClick={() =>
                                                        handleSave(row[fieldsMeta.primary])
                                                    }
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={handleCancel}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <Actions actions={actions} row={row} />
                                        )}
                                    </FlexEvenly>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        {data?.length === 0 && !loading && (
                            <StyledTableRow>
                                <StyledTableCell
                                    colspan={2 + fields.filter((f) => f.show || f.view).length}
                                >
                                    <FlexEvenly>
                                        <Typography>No data available</Typography>
                                    </FlexEvenly>
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
            <FlexBetween m={1} flexDirection={"row-reverse"}>
                <Pagination
                    page={tableState.currentPage ?? 0}
                    count={Math.ceil(tableState.totalCount / tableState.pageSize) ?? 0}
                    onChange={(e, p) => handlePageChange(p)}
                    color="primary"
                    shape="rounded"
                />
            </FlexBetween>
        </>
    );
};

ListView.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    tableState: PropTypes.object,
    fields: PropTypes.array,
    loading: PropTypes.bool,
    editingId: PropTypes.any,
    fieldsMeta: PropTypes.shape({
        primary: PropTypes.string,
        root: PropTypes.string,
    }),
    handleChange: PropTypes.func,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    handlePageChange: PropTypes.func,
    handleViewOpen: PropTypes.func,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            sx: PropTypes.object,
            enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        }),
    ),
};

export default memo(ListView);
