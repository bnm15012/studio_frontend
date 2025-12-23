import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useRef } from "react";

// const A4_WIDTH_PX = 794; // 210mm at 96 DPI
// const A4_HEIGHT_PX = 1100; // 297mm at 96 DPI

const PDFPreviewGenerator = ({ children, pdfOptions }) => {
    const contentRef = useRef(null);
    // const [pageImages, setPageImages] = useState([]);
    // const [loading, setLoading] = useState(false);

    // const generatePdfPreview = async () => {
    //     if (!contentRef.current) return;
    //     setLoading(true);
    //     setPageImages([]);

    //     const canvas = await window
    //         .html2pdf()
    //         .set(pdfOptions)
    //         .from(contentRef.current)
    //         .outputPdf("blob")
    //         .then(async (pdfBlob) => {
    //             const pdf = await pdfjsLib.getDocument({ data: await pdfBlob.arrayBuffer() })
    //                 .promise;
    //             const firstPage = await pdf.getPage(1);
    //             const viewport = firstPage.getViewport({ scale: 1.5 });
    //             const tempCanvas = document.createElement("canvas");
    //             const context = tempCanvas.getContext("2d");
    //             tempCanvas.width = viewport.width;
    //             tempCanvas.height = viewport.height;
    //             await firstPage.render({ canvasContext: context, viewport }).promise;
    //             return tempCanvas;
    //         });

    //     const contentHeight = canvas.height;
    //     const contentWidth = canvas.width;
    //     const pageHeight = (A4_HEIGHT_PX * contentWidth) / A4_WIDTH_PX;

    //     const pages = [];
    //     let position = 0;

    //     while (position < contentHeight) {
    //         const pageCanvas = document.createElement("canvas");
    //         pageCanvas.width = contentWidth;
    //         pageCanvas.height = pageHeight;

    //         const pageCtx = pageCanvas.getContext("2d");
    //         pageCtx.drawImage(
    //             canvas,
    //             0,
    //             position,
    //             contentWidth,
    //             pageHeight,
    //             0,
    //             0,
    //             contentWidth,
    //             pageHeight,
    //         );

    //         pages.push(pageCanvas.toDataURL("image/png"));
    //         position += pageHeight;
    //     }

    //     setPageImages(pages);
    //     setLoading(false);
    // };

    // useEffect(() => {
    //     generatePdfPreview();
    // }, [children]);

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                ref={contentRef}
                sx={{
                    // position: "absolute",
                    // zIndex: -1,
                    width: "210mm",
                    bgcolor: "white",
                    p: 4,
                    mx: "auto",
                }}
            >
                {children}
            </Box>
            {/* <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    overflowY: "auto",
                    maxHeight: "80vh",
                }}
            >
                {loading && <CircularProgress />}
                {!loading &&
                    pageImages.map((img, i) => (
                        <Box
                            key={i}
                            component="img"
                            src={img}
                            alt={`PDF page ${i + 1}`}
                            sx={{
                                width: "100%",
                                aspectRatio: "210 / 297",
                                border: "1px solid #ddd",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                bgcolor: "white",
                            }}
                        />
                    ))}
            </Box> */}
        </Box>
    );
};

PDFPreviewGenerator.propTypes = {
    pdfOptions: PropTypes.object,
    children: PropTypes.node.isRequired,
};

export default PDFPreviewGenerator;
