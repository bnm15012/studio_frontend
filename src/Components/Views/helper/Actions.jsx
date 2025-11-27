import { IconButton } from "@mui/material";
import PropTypes from "prop-types";

const Actions = ({ actions, row }) => (
    <>
        {actions
            .filter((a) => !a.hide)
            .map(({ name, enabled, onClick, icon, sx }) => {
                const isEnabled = typeof enabled === "function" ? enabled(row) : enabled;

                return (
                    <IconButton
                        key={name}
                        disabled={!isEnabled}
                        sx={sx}
                        onClick={() => onClick(row)}
                    >
                        {icon || name}
                    </IconButton>
                );
            })}
    </>
);

Actions.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            icon: PropTypes.element,
            sx: PropTypes.object,
            hide: PropTypes.bool,
            enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        }),
    ),
    row: PropTypes.object.isRequired,
};

export default Actions;
