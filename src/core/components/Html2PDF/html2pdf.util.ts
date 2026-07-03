export const getA4Dimensions = (): { width: number; height: number } => {
    const div = document.createElement("div");
    div.style.width = "1in";
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    const dpi = div.getBoundingClientRect().width;
    document.body.removeChild(div);
    const width = (210 * dpi) / 25.4;
    const height = (297 * dpi) / 25.4;
    return { width, height };
};

export const createPage = (): HTMLDivElement => {
    const div = document.createElement("div");
    div.className = "pdf-page";
    const { width, height } = getA4Dimensions();
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.position = "relative"; // Ensure relative positioning for absolute children
    return div;
};

export const createTable = (): HTMLTableElement => {
    const table = document.createElement("table");
    return table;
};

export const paginate = (preview: HTMLDivElement | null, source: HTMLDivElement | null): void => {
    if (!preview || !source) return;

    preview.innerHTML = "";

    // We get all children EXCEPT the footer wrapper
    const childrenToPaginate = Array.from(source.children).filter(
        (child) => !child.classList.contains("footer-wrapper")
    );

    let page = createPage();
    preview.appendChild(page);

    for (const block of childrenToPaginate) {
        const table = block.querySelector("table");

        // ✅ Normal content (no table)
        if (!table) {
            let blockCloneContainer = block.cloneNode(false) as HTMLDivElement; // Clone only the container (no children)
            page.appendChild(blockCloneContainer);

            // If the block has no child nodes (e.g. <hr>), we are done
            if (block.childNodes.length === 0) {
                continue;
            }

            // We iterate over the child nodes of the block
            for (const childNode of Array.from(block.childNodes)) {
                const childClone = childNode.cloneNode(true);
                blockCloneContainer.appendChild(childClone);

                if (page.scrollHeight > page.clientHeight) {
                    // It overflows! Remove the child node from the current container
                    blockCloneContainer.removeChild(childClone);

                    // Create a new page
                    page = createPage();
                    preview.appendChild(page);

                    // Create a new container on the new page
                    const newContainer = block.cloneNode(false) as HTMLDivElement;
                    page.appendChild(newContainer);
                    newContainer.appendChild(childClone);

                    // Update our reference to blockCloneContainer for subsequent children
                    blockCloneContainer = newContainer;
                }
            }
            continue;
        }

        // ✅ Block WITH table
        const tableHeader = table.querySelector("thead")?.cloneNode(true);
        const rowsToPaginate = Array.from(table.rows).filter((row) => !row.closest("thead"));

        let newTable = createTable();
        if (tableHeader) newTable.appendChild(tableHeader);
        page.appendChild(newTable);

        for (const row of rowsToPaginate) {
            const rowClone = row.cloneNode(true);
            newTable.appendChild(rowClone);

            if (page.scrollHeight > page.clientHeight) {
                newTable.removeChild(rowClone);

                page = createPage();
                preview.appendChild(page);

                newTable = createTable();
                if (tableHeader) newTable.appendChild(tableHeader.cloneNode(true));
                page.appendChild(newTable);
                newTable.appendChild(rowClone);
            }
        }
    }
};
