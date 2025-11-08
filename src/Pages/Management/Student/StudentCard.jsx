import PropTypes from "prop-types";

const StudentCard = ({ row }) => {
    const { name } = row;
    return <div>{name}</div>;
};

StudentCard.propTypes = {
    row: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default StudentCard;
