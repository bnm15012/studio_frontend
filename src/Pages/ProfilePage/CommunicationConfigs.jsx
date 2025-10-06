import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Divider, IconButton, Typography, Tooltip, Box } from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import PropTypes from "prop-types";
import EditableData from "../../Components/EditableData";
import { useDispatch, useSelector } from "react-redux";
import { updateStudio } from "../Auth/auth.api";
import { useAlert } from "../../utils/Alert";
import Loading from "../../Components/Loading/Loading";
import WhatsAppConfiguration from "./WhatsAppConfiguration";
import { useUI } from "../../context/UIContext";

const CommunicationConfigs = ({ studio }) => {
    const showAlert = useAlert();
    const { isAdmin } = useUI();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [editProf, setEditProf] = useState(false);

    const [editedValues, setEditedValues] = useState({
        studioId: studio.studioId,
        passcode: "",
    });

    const saveProfile = async () => {
        setLoading(true);
        const response = await updateStudio({
            values: editedValues,
            dispatch,
            token,
        });
        setLoading(false);
        showAlert(response.message, response.success ? "success" : "error");
    };

    useEffect(() => {
        setEditedValues({
            studioId: studio.studioId,
            passcode: studio?.passcode || "",
        });
    }, [studio]);

    return (
        <Box sx={{ px: 3 }}>
            {loading && <Loading />}
            {/* Email Configuration Section */}
            <FlexBetween flexDirection={"column"} gap={5}>
                {isAdmin && (
                    <Box>
                        <FlexBetween>
                            <Typography variant="h6" fontWeight="bold">
                                Email Configuration
                            </Typography>
                            <Tooltip title={editProf ? "Save Changes" : "Edit"}>
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        if (editProf) saveProfile();
                                        setEditProf(!editProf);
                                    }}
                                >
                                    {editProf ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                            </Tooltip>
                        </FlexBetween>
                        <Divider sx={{ mb: 2 }} />
                        <FlexBetween>
                            <Typography width={"8rem"} color="primary" fontWeight={"bolder"}>
                                Email
                            </Typography>
                            <Box px={1}>{studio.email}</Box>
                            <Box flexGrow={1}></Box>
                        </FlexBetween>
                        <FlexBetween>
                            <Typography width={"8rem"} color="primary" fontWeight={"bolder"}>
                                Passcode
                            </Typography>
                            <EditableData
                                showFieldName={false}
                                data={editedValues}
                                isEdit={editProf}
                                fieldName="passcode"
                                setData={setEditedValues}
                                validation={{
                                    pattern: /^[^\s]{16}$/,
                                    errorMessage: "Must be exactly 16 characters with no spaces",
                                }}
                            />
                            <Box flexGrow={1}></Box>
                        </FlexBetween>
                    </Box>
                )}
                <WhatsAppConfiguration studio={studio} />
            </FlexBetween>
        </Box>
    );
};

CommunicationConfigs.propTypes = {
    studio: PropTypes.shape({
        studioId: PropTypes.number.isRequired,
        whatsAppStatus: PropTypes.string,
        passcode: PropTypes.string,
        email: PropTypes.string,
    }).isRequired,
};

export default CommunicationConfigs;
