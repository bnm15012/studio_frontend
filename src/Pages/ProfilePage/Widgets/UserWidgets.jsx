import { useEffect, useState } from "react";
import ClassIcon from "@mui/icons-material/Class";
import EmailIcon from "@mui/icons-material/Email";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Typography, Paper, IconButton, Tooltip, Divider, Box } from "@mui/material";
import { useTheme } from "@mui/material";
import FlexBetween from "../../../Components/FlexBetween";
import FlexEvenlyColumn from "../../../Components/FlexEvenlyColumn";
import ImageComponent from "../../../Components/ImageComponent";
import EditableData from "../../../Components/EditableData";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updateStudio } from "../../Auth/auth.api";
import { useAlert } from "../../../utils/Alert";
import { Percent } from "lucide-react";
import { useUI } from "../../../context/UIContext";

const UserWidgets = ({ admin, studio }) => {
  const theme = useTheme();
  const { isMobile } = useUI()
  const showAlert = useAlert();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isNonMobile = !isMobile;

  const [imageUrl, setImageUrl] = useState(null);
  const [studioLogo, setStudioLogo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({
    phone: "",
    studioName: "",
    location: "",
    gstNumber: "",
  });

  // Verify if changes were made
  const verifyChanges = (values) => {
    const userData = {
      phone: values.phone,
      imageUrl: imageUrl,
      userId: admin.userId
    };
    const studioData = {
      studioId: studio.studioId,
      studioName: values.studioName,
      location: values.location,
      logo: studioLogo,
      gstNumber: values.gstNumber,
    };

    const isUserChanged = values.phone !== admin.phone || imageUrl !== admin.imageUrl;
    const isStudioChanged =
      values.gstNumber !== studio.gstNumber ||
      values.studioName !== studio?.studioName ||
      values.location !== studio?.location ||
      studioLogo !== studio.logo;

    return { studioData: isStudioChanged ? studioData : null, userData: isUserChanged ? userData : null };
  };

  const saveProfile = async () => {
    const { userData, studioData } = verifyChanges(editedValues);
    let alertShown = false;

    if (userData) {
      const res = await updateProfile({ values: userData, dispatch, token });
      alertShown = true;
      showAlert(res.message, res.success ? "success" : "error");
    }

    if (studioData) {
      const res = await updateStudio({ values: studioData, dispatch, token });
      alertShown = true;
      showAlert(res.message, res.success ? "success" : "error");
    }

    if (!alertShown) showAlert("No changes to save", "info");
  };

  useEffect(() => {
    setEditedValues({
      userName: admin.userName || "",
      phone: admin.phone || "",
      studioName: studio?.studioName || "",
      location: studio?.location || "",
      gstNumber: studio?.gstNumber || "",
    });
    setStudioLogo(studio?.logo || null);
  }, [admin, studio]);

  if (!admin) return null;

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        maxWidth: "100%",
      }}
    >
      {/* Header: User Image and Name */}
      <FlexBetween>
        <FlexBetween
          flexDirection={isNonMobile ? "row" : "column"}
          alignItems={isNonMobile ? "center" : "flex-start"}
          sx={{ mb: 3 }}
        >
          <ImageComponent
            dirName="user"
            size={isNonMobile ? "100px" : "80px"}
            setImage={setImageUrl}
            image={admin.imageUrl}
            isCircular
            allowEdit={editMode}
          />
          <Box sx={{ ml: isNonMobile ? 3 : 0, mt: isNonMobile ? 0 : 2 }}>
            <Typography variant="h5" fontWeight={600}>
              {admin.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {admin.role}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </FlexBetween>
        <Box>
          <Tooltip title={editMode ? "Save Profile" : "Edit Profile"}>
            <IconButton
              onClick={() => setEditMode(!editMode)}
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                "&:hover": { backgroundColor: theme.palette.primary.main },
              }}
            >
              {editMode ? <SaveIcon onClick={saveProfile} /> : <EditIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </FlexBetween>

      <Divider sx={{ mb: 3 }} />

      {/* Content: Contact & Studio Info */}
      <FlexBetween flexDirection={isNonMobile ? "row" : "column"} gap={3}>
        <FlexEvenlyColumn gap={2} sx={{ flex: 1 }}>
          <Typography variant="h6">Contact Information</Typography>
          <Divider sx={{ mb: 1 }} />
          <EditableData
            showFieldName={false}
            data={admin}
            fieldName="email"
            icon={<EmailIcon />}
            setData={setEditedValues}
          />
          <EditableData
            showFieldName={false}
            data={editedValues}
            isEdit={editMode}
            fieldName="phone"
            validation={{ pattern: /^\+?[1-9]\d{9}$/ }}
            icon={<PhoneIcon />}
            setData={setEditedValues}
          />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Studio Information
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <EditableData
            showFieldName={false}
            data={editedValues}
            isEdit={editMode}
            fieldName="studioName"
            icon={<ClassIcon />}
            setData={setEditedValues}
          />
          <EditableData
            showFieldName={false}
            data={editedValues}
            isEdit={editMode}
            fieldName="location"
            icon={<LocationCityIcon />}
            setData={setEditedValues}
          />
          <EditableData
            showFieldName={false}
            data={editedValues}
            isEdit={editMode}
            fieldName="gstNumber"
            icon={<Percent />}
            setData={setEditedValues}
            placeholder="Enter GST Number"
          />
        </FlexEvenlyColumn>

        <Box sx={{ display: "flex", justifyContent: "center", mt: isNonMobile ? 0 : 3 }}>
          <ImageComponent
            dirName="studio"
            size={isNonMobile ? "200px" : "120px"}
            setImage={setStudioLogo}
            image={studio?.logo || "/assets/default_logo.png"}
            isCircular
            allowEdit={editMode}
          />
        </Box>
      </FlexBetween>
    </Paper>
  );
};

UserWidgets.propTypes = {
  admin: PropTypes.object.isRequired,
  studio: PropTypes.object.isRequired,
};

export default UserWidgets;
