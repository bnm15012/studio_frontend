/** Pure utility: computes the display row number based on current page and page size. */
interface TableState {
    currentPage: string | number;
    pageSize: number;
}

export const getRowNumber = (tableState: TableState, rowIndex: number): number => {
    const page = Math.max(1, parseInt(String(tableState.currentPage ?? 1), 10) || 1);
    const size = Math.max(1, Number(tableState.pageSize ?? 10) || 10);
    return (page - 1) * size + rowIndex + 1;
};
