import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../Components/FlexBetween";
import MenuItems from "./MenuItems";
import ImageComponent from "../../Components/ImageComponent";

export const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width: 660px)");
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
      <FlexBetween
        boxShadow={`0px 4px 4px -4px ${theme.palette.neutral.dark}`}
        backgroundColor={"rgb(37,10,49)"}
        zIndex={1000}
      >
        <FlexBetween gap={1} paddingRight={1} height={"7vh"}>
          <FlexBetween
            onClick={(event) => {
              event.preventDefault();
              navigate("/");
              setTimeout(() => {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }, 100);
            }}
            alignItems={"center"}
            gap={1}
          >
            <ImageComponent
              size={"7vh"}
              image={"/logo.png"}
              isCircular={false}
            />
            <Typography
              color={"white"}
              fontSize={"1.2rem"}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              textTransform={"uppercase"}
              fontWeight={"bold"}
            >
              Book & Manage
            </Typography>
          </FlexBetween>
        </FlexBetween>
        <FlexBetween gap={3} height={"7vh"} alignItems={"center"}>
          {isNonMobileScreens ? (
            <MenuItems />
          ) : (
            <Box sx={{ zIndex: "100" }}>
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                {isMobileMenuToggled ? (
                  <Close sx={{ color: "whitesmoke" }} />
                ) : (
                  <Menu sx={{ color: "whitesmoke" }} />
                )}
              </IconButton>
            </Box>
          )}
        </FlexBetween>
        {!isNonMobileScreens && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
              width: isMobileMenuToggled ? "70%" : "0",
              height: "100%",
              backgroundColor: "rgba(10,10,10,0.8)",
              boxShadow: isMobileMenuToggled
                ? `-5px 0px 15px rgba(0, 0, 0, 0.2)`
                : "none",
              zIndex: 10,
              overflow: "hidden",
              transition: "width 0.3s ease-in-out",
            }}
          >
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton onClick={() => setIsMobileMenuToggled(false)}>
                <Close />
              </IconButton>
            </Box>
            <FlexBetween
              flexDirection="column"
              alignItems="center"
              gap="2"
              padding="1rem"
              sx={{
                opacity: isMobileMenuToggled ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <MenuItems />
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </>
  );
};
