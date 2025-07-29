import { useMediaQuery } from "@mui/material";
import { createContext, useContext } from "react";

// type UIContextType = {
//   isMobile: boolean;
// };

const UIContext = createContext({ isMobile: false });

export const UIProvider = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 700px)");
  return (
    <UIContext.Provider value={{ isMobile }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
