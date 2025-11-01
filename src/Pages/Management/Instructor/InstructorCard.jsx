import PropTypes from "prop-types";

const InstructorCard = ({ row }) => {
    const { name } = row;
    return <div>{name}</div>;
};

InstructorCard.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default InstructorCard;
