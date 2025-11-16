const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Min 8 chars, 1 uppercase, 1 number, 1 special char

export const validatePassword = (password) => {
    if (!password) return { valid: false, message: "Password is required." };
    if (!passwordRegex.test(password))
        return {
            valid: false,
            message:
                "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.",
        };
    return { valid: true, message: "" };
};

export const validateAndProcessDates = ({ startDate, endDate, showAlert }) => {
    const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

    if (!isValidDate(startDate)) {
        console.error("Invalid start date:", startDate);
        showAlert("Invalid start date provided.");
        return false;
    }

    if (!isValidDate(endDate)) {
        console.error("Invalid end date:", endDate);
        showAlert("Invalid end date provided.");
        return false;
    }

    if (endDate < startDate) {
        showAlert("End date must be after the start date.");
        return false;
    }

    return true;
};
