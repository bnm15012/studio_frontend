import { useSelector, useDispatch } from "react-redux";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setCurrentBranch } from "../../state/branchSlice";
import { clearAllstate } from "../../state/thunks";
import { loadInitialDataAPI } from "../../utils/loadInitialData";

const BranchesDropdown = () => {
    const branches = useSelector((state) => state.branch.branches) || [];
    const currentBranch = useSelector((state) => state.branch.currentBranch) || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBranchChange = (event) => {
        const selectedBranchId = event.target.value;
        const selectedBranch = branches.find((branch) => branch.branchId === selectedBranchId);
        if (selectedBranch) {
            dispatch(setCurrentBranch(selectedBranch));
            dispatch(clearAllstate());
            dispatch(loadInitialDataAPI());
            navigate(`/dashboard`);
        }
    };

    return (
        <FormControl variant="standard" sx={{ width: "10rem", m: "auto" }}>
            <Select
                id="branches"
                sx={{
                    color: "white",
                    "& .MuiSelect-icon": { color: "white" },
                    "&:before": { borderBottom: "none" },
                    "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    "&:after": { borderBottom: "none" },
                }}
                value={currentBranch?.branchId ?? ""}
                onChange={handleBranchChange}
                displayEmpty
                renderValue={() => {
                    const branch = branches.find((b) => b.branchId === currentBranch.branchId);
                    return branch ? branch.name : "Select Branch";
                }}
            >
                {branches.map((branch) => (
                    <MenuItem
                        disabled={!branch.isActive}
                        key={branch.branchId}
                        value={branch.branchId}
                        selected={branch.branchId === currentBranch?.branchId}
                    >
                        {branch.name}
                        {!branch.isActive && "(Disabled)"}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BranchesDropdown;
