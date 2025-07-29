import SelfImprovementIcon from "@mui/icons-material/SelfImprovement"; // YOGA
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics"; // ZUMBA
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"; // GYM
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"; // BACHATA
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"; // SAMBA
import MusicNoteIcon from "@mui/icons-material/MusicNote"; // SOCA
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy"; // HIP_HOP
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew"; // BELLY_DANCE
import GroupsIcon from "@mui/icons-material/Groups"; // BHANGRA
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi"; // MARTIAL_ARTS

export const validActivityTypes = [
  "GYM",
  "DANCE",
  "ZUMBA",
  "YOGA",
  // "BACHATA",
  // "SAMBA",
  // "SOCA",
  // "HIP_HOP",
  // "BELLY_DANCE",
  // "BHANGRA",
  "MARTIAL_ARTS",
];
export const validMembershipTypes = [
  "REGISTRATION",
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY"
];

export const getIcon = (activityType) => {
  switch (activityType) {
    case "YOGA":
      return (<SelfImprovementIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="primary" />);
    case "ZUMBA":
      return (
        <SportsGymnasticsIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="secondary" />
      );
    case "GYM":
      return <FitnessCenterIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="action" />;
    case "BACHATA":
      return <DirectionsRunIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="success" />;
    case "SAMBA":
      return <EmojiPeopleIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="warning" />;
    case "SOCA":
      return <MusicNoteIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="info" />;
    case "HIP_HOP":
      return <TheaterComedyIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="error" />;
    case "DANCE":
      return (
        <AccessibilityNewIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="error" />
      );
    case "BHANGRA":
      return <GroupsIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="primary" />;
    case "MARTIAL_ARTS":
      return <SportsKabaddiIcon sx={{ fontSize: "8rem", paddingBottom: 0 }} color="success" />;
    default:
      return null;
  }
};
