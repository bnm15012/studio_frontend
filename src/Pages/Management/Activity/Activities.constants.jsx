import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GestureIcon from "@mui/icons-material/Gesture";
import StarIcon from "@mui/icons-material/Star";
import CelebrationIcon from "@mui/icons-material/Celebration";

export const validActivityTypes = [
  "GYM",
  "DANCE",
  "ZUMBA",
  "YOGA",
  "BOLLYHOP",
  "GYMNASTICS",
  "KATHAK",
  "BHARATNATYAM",
  "FREESTYLE",
  "SEMI_CLASSICAL",
  "MARTIAL_ARTS",
];

export const getIcon = (activityType) => {
  switch (activityType) {
    case "YOGA":
      return <SelfImprovementIcon sx={{ paddingBottom: 0 }} color="primary" />;
    case "ZUMBA":
      return <SportsGymnasticsIcon sx={{ paddingBottom: 0 }} color="secondary" />;
    case "GYM":
      return <FitnessCenterIcon sx={{ paddingBottom: 0 }} color="action" />;
    case "BACHATA":
      return <DirectionsRunIcon sx={{ paddingBottom: 0 }} color="success" />;
    case "SAMBA":
      return <EmojiPeopleIcon sx={{ paddingBottom: 0 }} color="warning" />;
    case "SOCA":
      return <MusicNoteIcon sx={{ paddingBottom: 0 }} color="info" />;
    case "HIP_HOP":
      return <TheaterComedyIcon sx={{ paddingBottom: 0 }} color="error" />;
    case "DANCE":
      return <AccessibilityNewIcon sx={{ paddingBottom: 0 }} color="error" />;
    case "BHANGRA":
      return <GroupsIcon sx={{ paddingBottom: 0 }} color="primary" />;
    case "MARTIAL_ARTS":
      return <SportsKabaddiIcon sx={{ paddingBottom: 0 }} color="success" />;
    case "BOLLYHOP":
      return <MusicVideoIcon sx={{ paddingBottom: 0 }} color="secondary" />;
    case "GYMNASTICS":
      return <SportsGymnasticsIcon sx={{ paddingBottom: 0 }} color="info" />;
    case "KATHAK":
      return <GestureIcon sx={{ paddingBottom: 0 }} color="warning" />;
    case "BHARATNATYAM":
      return <StarIcon sx={{ paddingBottom: 0 }} color="error" />;
    case "FREESTYLE":
      return <EmojiEmotionsIcon sx={{ paddingBottom: 0 }} color="primary" />;
    case "SEMI_CLASSICAL":
      return <CelebrationIcon sx={{ paddingBottom: 0 }} color="success" />;
    default:
      return null;
  }
};


export const membershipTypeColors = [
  '#7c3aed',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444'
]

export const validMembershipTypes = [
  "REGISTRATION",
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY"
];
