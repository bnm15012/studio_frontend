import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useRef } from "react";

// const A4_WIDTH_PX = 794; // 210mm at 96 DPI
// const A4_HEIGHT_PX = 1100; // 297mm at 96 DPI

const PDFPreviewGenerator = ({ children, pdfOptions }) => {
    const contentRef = useRef(null);
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                className="main-pdf-content"
                ref={contentRef}
                sx={{
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
