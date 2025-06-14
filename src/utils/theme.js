export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#FAFAFA",
    50: "#F0F0F0",
    100: "#D9D9D9",
    200: "#BFBFBF",
    300: "#A6A6A6",
    400: "#8C8C8C",
    500: "#737373",
    600: "#595959",
    700: "#404040",
    800: "#262626",
    900: "#0D0D0D",
    1000: "#000000",
  },
  primary: {
    25: "#F5F9FF",
    50: "#EBF2FF",
    100: "#D6E4FF",
    200: "#ADC8FF",
    300: "#84A9FF",
    400: "#6690FF",
    500: "#3366FF",
    600: "#254EDA",
    700: "#1939B7",
    800: "#102693",
    900: "#08154D",
  },
  secondary: {
    25: "#FFFDE0",    // Very light yellow
    50: "#FFFAC2",    // Lighter yellow
    100: "#FFF7A4",
    200: "#FFF285",
    300: "#FFED66",
    400: "#FFE747",
    500: "#FFE229",   // Main yellow
    600: "#CCB61E",
    700: "#998914",
    800: "#665C0A",
    900: "#332E02",
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      primary: colorTokens.primary,
      secondary: colorTokens.secondary,
      ...(mode === "dark"
        ? {
          primary: {
            dark: colorTokens.primary[200],
            main: colorTokens.primary[500],
            hover: colorTokens.primary[700],
            light: colorTokens.primary[800],
          },
          secondary: {
            dark: colorTokens.secondary[100],
            main: colorTokens.secondary[400],
            light: colorTokens.secondary[700],
          },
          neutral: {
            dark: colorTokens.grey[100],
            main: colorTokens.grey[200],
            mediumMain: colorTokens.grey[300],
            medium: colorTokens.grey[400],
            light: colorTokens.grey[700],
          },
          background: {
            default: colorTokens.grey[900],
            alt: colorTokens.grey[1000],
          },
        }
        : {
          primary: {
            dark: colorTokens.primary[800],
            main: colorTokens.primary[700],
            medium: colorTokens.primary[500],
            light: colorTokens.primary[200],
          },
          secondary: {
            dark: colorTokens.secondary[700],
            main: colorTokens.secondary[400],
            light: colorTokens.secondary[100],
          },
          neutral: {
            dark: colorTokens.grey[1000],
            main: colorTokens.grey[700],
            medium: colorTokens.grey[500],
            light: colorTokens.grey[0],
          },
          background: {
            default: colorTokens.grey[0],
            alt: colorTokens.grey[0],
          },
        }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 16,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 48,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 28,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
    },
  };
};
