import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypeBackground {
        odd?: string;
        alt?: string;
    }

    interface Palette {
        neutral: {
            dark: string;
            main: string;
            mediumMain?: string;
            medium?: string;
            light: string;
        };
        gradients: {
            primary: string;
            secondary: string;
            greenToPurple: string;
            darkOverlay: string;
        };
        activityCardGradient: string[];
    }
    interface PaletteOptions {
        neutral?: {
            dark?: string;
            main?: string;
            mediumMain?: string;
            medium?: string;
            light?: string;
        };
        gradients?: {
            primary?: string;
            secondary?: string;
            greenToPurple?: string;
            darkOverlay?: string;
        };
        activityCardGradient?: string[];
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        save: true;
    }
}

const generateShadows = (rgbColor: string): string[] => {
    const shadows = [
        "none",
        ...Array(24)
            .fill("")
            .map((_, i) => {
                const index = i + 1; // Start from i=1
                const yOffset = index;
                const blur = index * 2;
                const spread = Math.max(0, index - 10) * 0.5;
                const opacity1 = Math.min(0.02 + index * 0.01, 0.2);
                const opacity2 = Math.min(0.015 + index * 0.008, 0.15);

                return [
                    `0px ${yOffset}px ${blur}px ${spread}px rgba(${rgbColor}, ${opacity1.toFixed(3)})`,
                    `0px ${Math.round(yOffset / 2)}px ${Math.round(blur / 2)}px rgba(${rgbColor}, ${opacity2.toFixed(3)})`,
                ].join(", ");
            }),
    ];

    return shadows;
};

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
        800: "#111f64ff",
        900: "#08154D",
    },
    secondary: {
        25: "#F3E9F8",
        50: "#E6D4F0",
        100: "#D9BFE8",
        200: "#C399D8",
        300: "#AD73C8",
        400: "#974DB8",
        500: "#8127A8",
        600: "#681E86",
        700: "#4F1664",
        800: "#360F42",
        900: "#1B071F",
    },
    activityCardGradient: {
        dark: [
            "linear-gradient(130deg,rgb(243, 187, 134), #F0F0F0)",
            "linear-gradient(130deg,rgb(121, 229, 229), #F0F0F0)",
            "linear-gradient(130deg,rgb(233, 243, 123), #F0F0F0)",
            "linear-gradient(130deg,rgb(228, 128, 207), #F0F0F0)",
            "linear-gradient(130deg,rgb(196, 245, 140), #F0F0F0)",
            "linear-gradient(130deg,rgb(249, 181, 113), #F0F0F0)",
            "linear-gradient(130deg,rgb(134, 209, 246), #F0F0F0)",
        ],
        light: [
            `linear-gradient(120deg,rgba(11, 120, 175, 1), #262626)`,
            `linear-gradient(120deg,rgba(182, 99, 17, 1), #262626)`,
            `linear-gradient(120deg,rgba(143, 226, 48, 1), #262626)`,
            `linear-gradient(120deg,rgba(236, 56, 197, 1), #262626)`,
            `linear-gradient(120deg,rgba(222, 240, 26, 1), #262626)`,
            `linear-gradient(120deg,rgba(43, 230, 230, 1), #262626)`,
            `linear-gradient(120deg,rgba(245, 141, 44, 1), #262626)`,
        ],
    },
    gradients: {
        light: {
            primary: "linear-gradient(90deg, #3392ffff 0%, #6690FF 100%)",
            secondary: "linear-gradient(90deg, #FFE229 0%, #FFF7A4 100%)",
            greenToPurple: "linear-gradient(135deg, #3366FF 0%, #9C27B0 100%)",
            darkOverlay: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
        },
        dark: {
            primary: "linear-gradient(90deg, #ADC8FF 0%, #1939B7 100%)",
            secondary: "linear-gradient(90deg, #FFF285 0%, #998914 100%)",
            greenToPurple: "linear-gradient(135deg, #ADC8FF 0%, #6A1B9A 100%)",
            darkOverlay: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)",
        },
    },
    shadows: {
        light: generateShadows("0, 0, 0"),
        dark: generateShadows("255, 255, 255"),
    },
};

export const themeSettings = (mode: "light" | "dark"): ThemeOptions => ({
    shadows: colorTokens.shadows[mode],
    palette: {
        mode: mode,
        ...(mode === "dark"
            ? {
                  primary: {
                      dark: colorTokens.primary[200],
                      main: colorTokens.primary[500],
                      light: colorTokens.primary[800],
                      contrastText: "#ffffff",
                  },
                  secondary: {
                      dark: colorTokens.secondary[100],
                      main: colorTokens.secondary[400],
                      light: colorTokens.secondary[700],
                      contrastText: colorTokens.grey[900],
                  },
                  neutral: {
                      dark: colorTokens.grey[100],
                      main: colorTokens.grey[200],
                      mediumMain: colorTokens.grey[300],
                      medium: colorTokens.grey[400],
                      light: colorTokens.grey[700],
                  },
                  background: {
                      default: colorTokens.grey[1000],
                      paper: colorTokens.grey[800],
                      odd: colorTokens.grey[700],
                      alt: colorTokens.grey[800],
                  },
                  text: {
                      primary: colorTokens.grey[100],
                      secondary: colorTokens.grey[300],
                  },
              }
            : {
                  primary: {
                      dark: colorTokens.primary[800],
                      main: colorTokens.primary[700],
                      light: colorTokens.primary[200],
                      contrastText: "#ffffff",
                  },
                  secondary: {
                      dark: colorTokens.secondary[700],
                      main: colorTokens.secondary[400],
                      light: colorTokens.secondary[100],
                      contrastText: colorTokens.grey[900],
                  },
                  neutral: {
                      dark: colorTokens.grey[1000],
                      main: colorTokens.grey[700],
                      medium: colorTokens.grey[500],
                      light: colorTokens.grey[0],
                  },
                  background: {
                      default: colorTokens.grey[0],
                      paper: colorTokens.grey[50],
                      alt: colorTokens.grey[100],
                      odd: colorTokens.grey[10],
                  },
                  text: {
                      primary: colorTokens.grey[900],
                      secondary: colorTokens.grey[600],
                  },
              }),
        success: {
            main: "#10B981",
            contrastText: "#ffffff",
        },
        warning: {
            main: "#F59E0B",
            contrastText: "#ffffff",
        },
        error: {
            main: "#EF4444",
            contrastText: "#ffffff",
        },
        gradients: colorTokens.gradients[mode],
        activityCardGradient: colorTokens.activityCardGradient[mode],
    },
    typography: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
        h1: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.2,
            "@media (min-width:1024px)": {
                fontSize: 56,
            },
        },
        h2: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.3,
            "@media (min-width:1024px)": {
                fontSize: 48,
            },
        },
        h3: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontFamily: ["Rubik", "sans-serif"].join(","),
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: 16,
            lineHeight: 1.6,
        },
        body2: {
            fontSize: 14,
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiIconButton: {
            defaultProps: {
                color: "primary",
            },
        },
        MuiSelect: {
            defaultProps: {
                MenuProps: {
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 3 + 8,
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 12,
                    padding: "12px 24px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                    },
                    "&.Mui-disabled": {
                        background: "linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)",
                        color: "#F8FAFC",
                        boxShadow: "none",
                        opacity: 0.75,
                        cursor: "not-allowed",
                        transform: "none",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #601dfcff 0%, #1d6ef1ff 100%)",
                    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                    },
                },
                outlined: {
                    borderWidth: 2,
                    "&:hover": {
                        borderWidth: 2,
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                    },
                },
                sizeLarge: {
                    padding: "16px 32px",
                    fontSize: "1.125rem",
                },
            },

            variants: [
                {
                    props: { variant: "save" },
                    style: {
                        background: "linear-gradient(135deg, #1FBF3F 0%, #067A12 100%)",
                        color: "#ffffff",
                        boxShadow: "0 4px 5px rgba(105, 246, 92, 0.4)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #55E07B 0%, #05630F 100%)",
                        },
                    },
                },
            ],
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 24,
                    paddingRight: 24,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    boxShadow: "none !important",
                },
            },
        },
    },
});

const theme = createTheme(themeSettings("light"));

export default theme;
