import { IconButton, Tooltip } from "@mui/material";
import PropTypes from "prop-types";

const Actions = ({ actions, row }) => (
    <>
        {actions
            .filter((a) => !a.hide)
            .map(({ name, enabled, onClick, icon, sx }) => {
                const isEnabled = typeof enabled === "function" ? enabled(row) : enabled;
                return (
                    <Tooltip key={name} title={name} placement="top" arrow>
                        <IconButton
                            disabled={!isEnabled}
                            sx={sx}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(row);
                            }}
                        >
                            {icon || name}
                        </IconButton>
                    </Tooltip>
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
