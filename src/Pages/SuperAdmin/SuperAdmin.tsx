import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    TableBody,
    TableHead,
    Button,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Tooltip,
    keyframes,
} from "@mui/material";
import {
    Login as LoginIcon,
    Edit as EditIcon,
    CurrencyRupee as RupeeIcon,
    Refresh as RefreshIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import { useAlert } from "@/core/components/feedback/Alert";
import { useAppDispatch, store, RootState } from "@/state";
import { setLogin, setSubscriptionPlan, setAuthLoading } from "@/state/authSlice";
import { branchCruds } from "@/api/all.api";
import type { Branch } from "@/api/types";
import {
    fetchAllStudios,
    loginAsStudio,
    fetchStudioPlans,
    upsertStudioPlan,
    type StudioListItem,
    type StudioPlanItem,
} from "@/Pages/SuperAdmin/superadmin.api";
import { getAllPlans } from "@/Pages/Pricing/plans.api";
import WidgetsOnPage from "@/core/components/layout/WidgetsOnPage";
import TopProgressBar from "@/core/components/loading/TopProgressBar";
import StyledDialog from "@/core/components/dialogs/StyledDialog";
import {
    StyledTable,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from "@/core/components/tables/StyledTableComponents";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { iconBtnFilledSx } from "@/core/components/layout/ActionButtonStyle";
import { SearchIcon } from "lucide-react";

interface PlanOption {
    id: number;
    planType: string;
    amount: number;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const SuperAdmin: React.FC = () => {
    const dispatch = useAppDispatch();
    const showAlert = useAlert();

    const [studios, setStudios] = useState<StudioListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
    const [selectedStudio, setSelectedStudio] = useState<StudioListItem | null>(null);
    const [globalPlans, setGlobalPlans] = useState<PlanOption[]>([]);
    const [studioPlans, setStudioPlans] = useState<StudioPlanItem[]>([]);
    const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});
    const [savingPlan, setSavingPlan] = useState(false);

    const loadStudios = useCallback(async () => {
        setLoading(true);
        const result = await fetchAllStudios();
        if (result.success && result.data) {
            setStudios(result.data);
        } else {
            showAlert("Failed to fetch studios", "error");
        }
        setLoading(false);
    }, [showAlert]);

    useEffect(() => {
        loadStudios();
    }, [loadStudios]);

    const handleLoginAsStudio = async (studio: StudioListItem) => {
        dispatch(setAuthLoading({ loading: true }));
        const result = await loginAsStudio(studio.studioId);
        if (result.success && result.data) {
            const authData = result.data;
            const currentState = store.getState() as RootState;
            sessionStorage.setItem("superAdminAuth", JSON.stringify(currentState.auth));
            sessionStorage.setItem("superAdminBranch", JSON.stringify(currentState.branch));
            dispatch(
                setLogin({
                    user: authData,
                    token: authData.token,
                    studio: authData.studioEntry,
                    settings: authData.studioEntry.configuration.configrationEntryList,
                }),
            );
            dispatch(
                branchCruds.actions.setItems({
                    data: authData.studioEntry.branchList,
                    rootId: authData.studioEntry.studioId,
                }),
            );
            const activeBranch =
                authData.studioEntry.branchList.find((b: Branch) => b.isActive) ||
                authData.studioEntry.branchList[0];
            if (activeBranch) {
                dispatch(branchCruds.actions.setCurrentBranch(activeBranch));
            }
            dispatch(setSubscriptionPlan({ subscriptionPlan: authData.subscriptionEntry }));
            showAlert(`Logged in as ${studio.studioName}`, "success");
            window.location.hash = "#/dashboard";
        } else {
            showAlert("Failed to login as studio", "error");
        }
        setTimeout(() => dispatch(setAuthLoading({ loading: false })), 600);
    };

    const handleOpenPricing = async (studio: StudioListItem) => {
        setSelectedStudio(studio);
        setPricingDialogOpen(true);

        if (globalPlans.length === 0) {
            const plansResult = await getAllPlans({ AMC: false });
            if (plansResult.success && plansResult.data) {
                setGlobalPlans(
                    plansResult.data.map((p: { id: number; planType: string; amount: number }) => ({
                        id: p.id,
                        planType: p.planType,
                        amount: p.amount,
                    })),
                );
            }
        }

        const spResult = await fetchStudioPlans(studio.studioId);
        if (spResult.success && spResult.data) {
            setStudioPlans(spResult.data);
            const amounts: Record<number, string> = {};
            spResult.data.forEach((sp: StudioPlanItem) => {
                amounts[sp.planId] = String(sp.customAmount);
            });
            setCustomAmounts(amounts);
        } else {
            setStudioPlans([]);
            setCustomAmounts({});
        }
    };

    const handleSavePlan = async (planId: number) => {
        if (!selectedStudio) return;
        const amount = parseFloat(customAmounts[planId] || "0");
        if (isNaN(amount) || amount <= 0) {
            showAlert("Enter a valid amount", "warning");
            return;
        }
        setSavingPlan(true);
        const result = await upsertStudioPlan({
            studioId: selectedStudio.studioId,
            planId,
            customAmount: amount,
        });
        if (result.success) {
            showAlert("Plan price saved", "success");
            const spResult = await fetchStudioPlans(selectedStudio.studioId);
            if (spResult.success && spResult.data) {
                setStudioPlans(spResult.data);
            }
        } else {
            showAlert("Failed to save plan price", "error");
        }
        setSavingPlan(false);
    };

    const filteredStudios = studios.filter(
        (s) =>
            s.studioName?.toLowerCase().includes(search.toLowerCase()) ||
            s.email?.toLowerCase().includes(search.toLowerCase()) ||
            s.location?.toLowerCase().includes(search.toLowerCase()),
    );

    const getStatusColor = (status?: string): "success" | "error" | "warning" | "default" => {
        if (!status) return "default";
        const s = status.toUpperCase();
        if (s === "ACTIVE") return "success";
        if (s === "EXPIRED") return "error";
        if (s === "CREATED") return "warning";
        return "default";
    };

    return (
        <WidgetsOnPage isSidebarShouldBeOn={true}>
            <Box
                sx={{
                    py: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                    height: "100%",
                }}
            >
                <TopProgressBar loading={loading} />

                <Box
                    sx={{
                        borderRadius: { xs: 3, md: 4 },
                        p: { xs: 2, sm: 2.5, md: 3 },
                        background:
                            "linear-gradient(135deg, #1e3a8a 0%, #312e81 40%, #4c1d95 80%, #6d28d9 100%)",
                        color: "white",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 8px 32px rgba(99,57,255,0.35), 0 2px 8px rgba(0,0,0,0.2)",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                            pointerEvents: "none",
                        },
                        animation: `${fadeInUp} 0.5s ease-out`,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
                        <BusinessIcon sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }} />
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2rem" },
                                    letterSpacing: "-0.5px",
                                    textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                                    lineHeight: 1.2,
                                }}
                            >
                                Super Admin Panel
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.7,
                                    mt: 0.25,
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                }}
                            >
                                {studios.length} studios registered
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <FlexBetween gap={1} sx={{ height: "3rem", alignItems: "center" }}>
                    <FlexBetween
                        sx={{
                            width: "100%",
                            gap: 1,
                            px: 2,
                            borderRadius: "12px",
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        <TextField
                            placeholder="Search studios..."
                            variant="standard"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                            sx={{ "& .MuiInputBase-root": { height: "1rem" } }}
                        />
                        <IconButton sx={{ ...iconBtnFilledSx, width: "2rem", height: "2rem" }}>
                            <SearchIcon size={18} />
                        </IconButton>
                    </FlexBetween>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                        <Tooltip title="Refresh">
                            <IconButton onClick={loadStudios} sx={iconBtnFilledSx}>
                                <RefreshIcon sx={{ fontSize: "1.25rem" }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </FlexBetween>

                <StyledTableContainer>
                    <StyledTable>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>#</StyledTableCell>
                                <StyledTableCell>Studio Name</StyledTableCell>
                                <StyledTableCell>Location</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Subscription</StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell>End Date</StyledTableCell>
                                <StyledTableCell align="center">Pricing</StyledTableCell>
                                <StyledTableCell align="center">Login As</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudios.map((studio, index) => (
                                <StyledTableRow key={studio.studioId}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 600 }}>
                                        {studio.studioName}
                                    </StyledTableCell>
                                    <StyledTableCell>{studio.location}</StyledTableCell>
                                    <StyledTableCell>{studio.email}</StyledTableCell>
                                    <StyledTableCell>
                                        {studio.subscriptionEntry?.subscriptionPlan?.replace(
                                            "_",
                                            " ",
                                        ) || "-"}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Chip
                                            label={studio.subscriptionEntry?.status || "N/A"}
                                            color={getStatusColor(studio.subscriptionEntry?.status)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {studio.subscriptionEntry?.endDate
                                            ? new Date(
                                                  studio.subscriptionEntry.endDate,
                                              ).toLocaleDateString()
                                            : "-"}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Tooltip title="Manage custom pricing">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleOpenPricing(studio)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<LoginIcon />}
                                            onClick={() => handleLoginAsStudio(studio)}
                                        >
                                            Login
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {filteredStudios.length === 0 && (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No studios found
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </StyledTable>
                </StyledTableContainer>
            </Box>

            <StyledDialog
                open={pricingDialogOpen}
                onClose={() => setPricingDialogOpen(false)}
                title={`Custom Pricing - ${selectedStudio?.studioName || ""}`}
                cancelText="Close"
                size="sm"
            >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Set custom plan amounts for this studio. Leave blank to use global defaults.
                </Typography>
                <StyledTableContainer sx={{ maxHeight: "unset" }}>
                    <StyledTable>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Plan</StyledTableCell>
                                <StyledTableCell>Global Price</StyledTableCell>
                                <StyledTableCell>Custom Price</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {globalPlans.map((plan) => {
                                const existingPlan = studioPlans.find(
                                    (sp) => sp.planId === plan.id,
                                );
                                return (
                                    <StyledTableRow key={plan.id}>
                                        <StyledTableCell sx={{ fontWeight: 600 }}>
                                            {plan.planType.replace("_", " ")}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <RupeeIcon
                                                sx={{ fontSize: 14, verticalAlign: "middle" }}
                                            />
                                            {plan.amount}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    placeholder={String(plan.amount)}
                                                    value={customAmounts[plan.id] || ""}
                                                    onChange={(e) =>
                                                        setCustomAmounts((prev) => ({
                                                            ...prev,
                                                            [plan.id]: e.target.value,
                                                        }))
                                                    }
                                                    sx={{ width: 120 }}
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <RupeeIcon
                                                                        sx={{ fontSize: 14 }}
                                                                    />
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                                {existingPlan && (
                                                    <Chip
                                                        label="Custom"
                                                        size="small"
                                                        color="primary"
                                                    />
                                                )}
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                disabled={savingPlan}
                                                onClick={() => handleSavePlan(plan.id)}
                                            >
                                                Save
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </StyledTable>
                </StyledTableContainer>
            </StyledDialog>
        </WidgetsOnPage>
    );
};

export default SuperAdmin;
