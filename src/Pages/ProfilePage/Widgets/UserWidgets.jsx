import { useEffect, useState } from "react";
import {
  Class,
  Email,
  LocationCity,
  Phone,
  Edit,
  Save,
} from "@mui/icons-material";
import {
  CardContent,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import FlexBetween from "../../../Components/FlexBetween";
import ImageComponent from "../../../Components/ImageComponent";
import PropTypes from "prop-types";
import EditableData from "../../../Components/EditableData";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updateStudio } from "../../Auth/auth.api";
import { useAlert } from "../../../utils/Alert";
import FlexEvenlyColumn from "../../../Components/FlexEvenlyColumn";

const UserWidgets = ({ admin, studio }) => {
  const theme = useTheme();
  const showAlert = useAlert();
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const isNonMobileScreens = useMediaQuery("(min-width:700px)");
  const [imageUrl, setImageUrl] = useState(null);
  const [studioLogo, setStudioLogo] = useState(null);
  const [editProf, setEditProf] = useState(false);
  const [editedValues, setEditedValues] = useState({
    phone: "",
    studioName: "",
    location: "",
  });
  const verifyValuesChangedOrNot = (values) => {
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
    };

    const isUserDataChanged =
      values.phone !== admin.phone ||
      imageUrl !== admin.imageUrl;

    const isStudioDataChanged =
      values.studioName !== studio?.studioName ||
      values.location !== studio?.location ||
      studioLogo !== studio.logo;

    return { studioData: isStudioDataChanged ? studioData : null, userData: isUserDataChanged ? userData : null };
  }
  const saveProfile = async () => {
    const { userData, studioData } = verifyValuesChangedOrNot(editedValues)
    let show_alert = true;
    if (userData) {
      const response = await updateProfile({
        values: userData,
        dispatch,
        token,
      });
      show_alert = false;
      if (response.success) {
        showAlert(response.message, "success");
      } else {
        showAlert(response.message, "error");
      }
    }
    if (studioData) {
      const response = await updateStudio({
        values: studioData,
        dispatch,
        token,
      });
      show_alert = false;
      if (response.success) {
        showAlert(response.message, "success");
      } else {
        showAlert(response.message, "error");
      }
    }
    if (show_alert) {
      showAlert("No changes to save", "info");
    }
  }
  useEffect(() => {
    const updatedValues = {
      userName: admin.userName || "",
      phone: admin.phone || "",
      studioName: studio?.studioName || "",
      location: studio?.location || "",
    };

    setEditedValues((prev) => {
      const isSame = Object.keys(updatedValues).every(
        (key) => updatedValues[key] === prev[key]
      );
      return isSame ? prev : updatedValues;
    });
  }, [admin.userName, admin.phone, studio?.studioName, studio?.location]);

  if (!admin) return null;

  return (
    <FlexBetween>
      <Box>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ImageComponent
              dirName="user"
              size={isNonMobileScreens ? "100px" : "50px"}
              setImage={setImageUrl}
              image={admin?.imageUrl}
              isCircular={true}
              allowEdit={editProf}
            />
            <Box>
              <Typography variant="h5" fontWeight="500">
                {admin.userName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {admin.role}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title={editProf ? "Save Profile" : "Edit Profile"}>
              <IconButton
                size="medium"
                onClick={() => { setEditProf(!editProf); }}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {editProf ? <Save onClick={saveProfile} /> : <Edit />}
              </IconButton>
            </Tooltip>
          </Box>
          <FlexBetween flexWrap={"wrap"}>
            <CardContent sx={{ width: "100%" }}>
              <FlexBetween>
                <Box>
                  <Typography variant="h6">
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Box sx={{ display: "grid", gap: 2 }}>
                    <EditableData showFieldName={false} data={admin} fieldName={"email"} icon={<Email />} setData={setEditedValues} />
                    <EditableData showFieldName={false} data={editedValues} isEdit={editProf} fieldName={"phone"}
                      validation={{ pattern: /^\+?[1-9]\d{9}$/ }} icon={<Phone />} setData={setEditedValues} />
                  </Box>
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Studio Information
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <FlexBetween gap={2}>
                    <FlexEvenlyColumn gap={2} sx={{ flexGrow: 1 }}>
                      <EditableData showFieldName={false} data={editedValues} isEdit={editProf} fieldName={"studioName"} icon={<Class />} setData={setEditedValues} />
                      <EditableData showFieldName={false} data={editedValues} isEdit={editProf} fieldName={"location"} icon={<LocationCity />} setData={setEditedValues} />
                    </FlexEvenlyColumn>
                  </FlexBetween>
                </Box>
                <FlexBetween height={"17rem"} flexDirection={"column-reverse"}>
                  <ImageComponent
                    dirName="studio"
                    size={isNonMobileScreens ? "200px" : "50px"}
                    setImage={setStudioLogo}
                    image={studio?.logo || "/assets/default_logo.png"}
                    isCircular={true}
                    allowEdit={editProf}
                  />
                </FlexBetween>
              </FlexBetween>
            </CardContent>
          </FlexBetween>
        </Paper>
      </Box>
    </FlexBetween>
  );
};

UserWidgets.propTypes = {
  admin: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  studio: PropTypes.shape({
    studioId: PropTypes.number.isRequired,
    studioName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    logo: PropTypes.string,
  }).isRequired,
};

export default UserWidgets;
