export const getA4Dimensions = () => {
    const div = document.createElement("div");
    div.style.width = "1in";
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    const dpi = div.getBoundingClientRect().width;
    document.body.removeChild(div);
    const width = (210 * dpi) / 25.4;
    const height = (297 * dpi) / 25.6;
    return { width, height };
};

export const createPage = () => {
    const div = document.createElement("div");
    div.className = "pdf-page";
    const { width, height } = getA4Dimensions();
    div.style.width = width + "px";
    div.style.height = height + "px";
    return div;
};

export const createTable = () => {
    const table = document.createElement("table");
    return table;
};

export const paginate = (preview, source) => {
    if (!preview || !source) return;

    preview.innerHTML = "";

    let page = createPage();
    preview.appendChild(page);

    // Iterate over the children of the hidden source div
    for (const block of Array.from(source.children)) {
        const table = block.querySelector("table");

        // ✅ Normal content (no table)
        if (!table) {
            const clone = block.cloneNode(true);
            page.appendChild(clone);

            if (page.scrollHeight > page.clientHeight) {
                page.removeChild(clone);
                page = createPage();
                preview.appendChild(page);
                page.appendChild(clone);
            }
            continue;
        }

        // ✅ Block WITH table
        const header = block.querySelector("p")?.cloneNode(true);
        let newTable = createTable();

        if (header) page.appendChild(header);
        page.appendChild(newTable);

        for (const row of Array.from(table.rows)) {
            const rowClone = row.cloneNode(true);
            newTable.appendChild(rowClone);

            if (page.scrollHeight > page.clientHeight) {
                newTable.removeChild(rowClone);

                page = createPage();
                preview.appendChild(page);

                newTable = createTable();
                page.appendChild(newTable);
                newTable.appendChild(rowClone);
            }
        }
    }
};
