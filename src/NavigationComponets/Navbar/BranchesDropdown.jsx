import { useState } from "react";
import { Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { branchCruds } from "../../api/all.api";
import { clearAllstate } from "../../state/thunks";
import { loadInitialDataAPI } from "../../utils/loadInitialData";
import FlexBetween from "../../Components/FlexBetween";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useUI } from "../../context/UIContext";

const BranchesDropdown = () => {
    const { isMobile } = useUI();
    const branches = useSelector((state) => state.branch.items) || [];
    const currentBranch = useSelector((state) => state.branch.currentBranch) || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleBranchSelect = (branch) => {
        if (!branch.isActive) return;
        dispatch(branchCruds.setSelectedBranch(branch));
        dispatch(clearAllstate());
        dispatch(loadInitialDataAPI());
        navigate("/dashboard");
        handleClose();
    };

    return (
        <FlexBetween height="100%" alignItems="center">
            <Tooltip title={currentBranch?.name || "Select Branch"} placement="bottom">
                <Button sx={{ alignItems: "center", p: 1 }} onClick={handleClick}>
                    <FlexBetween color={"whitesmoke"} alignItems="center" width="100%">
                        <Typography
                            fontWeight="bolder"
                            textOverflow={"ellipsis"}
                            fontSize={isMobile ? "0.9rem" : "1rem"}
                        >
                            {isMobile
                                ? String(currentBranch.name || "B").charAt(0)
                                : currentBranch.name || "Select Branch"}
                        </Typography>
                        <ArrowDropDown fontSize="small" />
                    </FlexBetween>
                </Button>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {branches.map((branch) => {
                    const isDisabled = !branch.isActive;
                    const menuItem = (
                        <MenuItem
                            key={branch.branchId}
                            disabled={isDisabled}
                            selected={branch.branchId === currentBranch?.branchId}
                            onClick={() => handleBranchSelect(branch)}
                        >
                            {branch.name}
                        </MenuItem>
                    );

                    return isDisabled ? (
                        <Tooltip
                            key={branch.branchId}
                            title="This branch is inactive"
                            placement="top"
                        >
                            <span>{menuItem}</span>
                        </Tooltip>
                    ) : (
                        menuItem
                    );
                })}
            </Menu>
        </FlexBetween>
    );
};

export default BranchesDropdown;
