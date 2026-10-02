import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    TableBody,
    TableHead,
    Chip,
    IconButton,
    Tooltip,
    TextField,
    FormControlLabel,
    Switch,
    keyframes,
} from "@mui/material";
import {
    Refresh as RefreshIcon,
    CardGiftcard as PlansIcon,
    Star as StarIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { useAlert } from "@/core/components/feedback/Alert";
import { getAllPlans } from "@/Pages/Pricing/plans.api";
import { updatePlan, type PlanItem } from "@/Pages/SuperAdmin/superadmin.api";
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

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const PlansManagement: React.FC = () => {
    const showAlert = useAlert();
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editPlan, setEditPlan] = useState<PlanItem | null>(null);
    const [saving, setSaving] = useState(false);

    const loadPlans = useCallback(async () => {
        setLoading(true);
        const result = await getAllPlans({ AMC: false });
        if (result.success && result.data) {
            setPlans(result.data as PlanItem[]);
        } else {
            showAlert("Failed to fetch plans", "error");
        }
        setLoading(false);
    }, [showAlert]);

    useEffect(() => {
        loadPlans();
    }, [loadPlans]);

    const handleEdit = (plan: PlanItem) => {
        setEditPlan({ ...plan });
        setEditDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editPlan) return;
        setSaving(true);
        const result = await updatePlan(editPlan.id, editPlan);
        if (result.success) {
            showAlert("Plan updated successfully", "success");
            setEditDialogOpen(false);
            loadPlans();
        } else {
            showAlert("Failed to update plan", "error");
        }
        setSaving(false);
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
                        alignItems: "center",
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
                    <PlansIcon sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, zIndex: 1 }} />
                    <Box sx={{ zIndex: 1 }}>
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
                            Plans Management
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.7,
                                mt: 0.25,
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                            }}
                        >
                            {plans.length} global plans configured
                        </Typography>
                    </Box>
                </Box>

                <FlexBetween gap={1} sx={{ height: "3rem", alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Refresh">
                        <IconButton onClick={loadPlans} sx={iconBtnFilledSx}>
                            <RefreshIcon sx={{ fontSize: "1.25rem" }} />
                        </IconButton>
                    </Tooltip>
                </FlexBetween>

                <StyledTableContainer>
                    <StyledTable>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>#</StyledTableCell>
                                <StyledTableCell>Plan Type</StyledTableCell>
                                <StyledTableCell>Amount</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                                <StyledTableCell>Popular</StyledTableCell>
                                <StyledTableCell>SMS Quota</StyledTableCell>
                                <StyledTableCell>Remind Before</StyledTableCell>
                                <StyledTableCell>Features</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((plan, index) => (
                                <StyledTableRow key={plan.id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 600 }}>
                                        {plan.planType.replace(/_/g, " ")}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {"\u20B9"}
                                            {plan.amount?.toLocaleString() || 0}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>{plan.description || "-"}</StyledTableCell>
                                    <StyledTableCell>
                                        {plan.popular ? (
                                            <Chip
                                                icon={<StarIcon sx={{ fontSize: 14 }} />}
                                                label="Popular"
                                                size="small"
                                                color="warning"
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </StyledTableCell>
                                    <StyledTableCell>{plan.smsQuota || "-"}</StyledTableCell>
                                    <StyledTableCell>
                                        {plan.remindBeforeDays
                                            ? `${plan.remindBeforeDays} days`
                                            : "-"}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {plan.enabledFeatures?.map((f, i) => (
                                                <Chip
                                                    key={`e-${i}`}
                                                    label={f}
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ fontSize: "0.7rem" }}
                                                />
                                            ))}
                                            {plan.disabledFeatures?.map((f, i) => (
                                                <Chip
                                                    key={`d-${i}`}
                                                    label={f}
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    sx={{ fontSize: "0.7rem" }}
                                                />
                                            ))}
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Tooltip title="Edit Plan">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(plan)}
                                                sx={iconBtnFilledSx}
                                            >
                                                <EditIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            {plans.length === 0 && !loading && (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No plans found
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </StyledTable>
                </StyledTableContainer>
            </Box>

            <StyledDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                title={`Edit Plan - ${editPlan?.planType?.replace(/_/g, " ") || ""}`}
                confirmText={saving ? "Saving..." : "Save"}
                onConfirm={handleSave}
                confirmDisabled={saving}
                size="sm"
            >
                {editPlan && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <TextField
                            label="Amount"
                            type="number"
                            value={editPlan.amount ?? ""}
                            onChange={(e) =>
                                setEditPlan({ ...editPlan, amount: Number(e.target.value) })
                            }
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Description"
                            value={editPlan.description ?? ""}
                            onChange={(e) =>
                                setEditPlan({ ...editPlan, description: e.target.value })
                            }
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="SMS Quota"
                            type="number"
                            value={editPlan.smsQuota ?? ""}
                            onChange={(e) =>
                                setEditPlan({ ...editPlan, smsQuota: Number(e.target.value) })
                            }
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Remind Before (days)"
                            type="number"
                            value={editPlan.remindBeforeDays ?? ""}
                            onChange={(e) =>
                                setEditPlan({
                                    ...editPlan,
                                    remindBeforeDays: Number(e.target.value),
                                })
                            }
                            fullWidth
                            size="small"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editPlan.popular ?? false}
                                    onChange={(e) =>
                                        setEditPlan({ ...editPlan, popular: e.target.checked })
                                    }
                                />
                            }
                            label="Popular"
                        />
                        <TextField
                            label="Enabled Features (comma separated)"
                            value={editPlan.enabledFeatures?.join(", ") ?? ""}
                            onChange={(e) =>
                                setEditPlan({
                                    ...editPlan,
                                    enabledFeatures: e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean),
                                })
                            }
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Disabled Features (comma separated)"
                            value={editPlan.disabledFeatures?.join(", ") ?? ""}
                            onChange={(e) =>
                                setEditPlan({
                                    ...editPlan,
                                    disabledFeatures: e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean),
                                })
                            }
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                        />
                    </Box>
                )}
            </StyledDialog>
        </WidgetsOnPage>
    );
};

export default PlansManagement;
