/** Pure utility: computes the display row number based on current page and page size. */
interface TableState {
    currentPage: string | number;
    pageSize: number;
}

export const getRowNumber = (tableState: TableState, rowIndex: number): number =>
    (parseInt(String(tableState.currentPage)) - 1) * tableState.pageSize + rowIndex + 1;
