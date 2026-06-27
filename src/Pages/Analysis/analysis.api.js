import api from "../../core/util/api";

export const fetchReportData = async ({
    token,
    branchId,
    year = new Date().getFullYear(),
}) => {
    try {
        const response = await api.get(`/analysis/${year}/${branchId}`, {
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });

        const data = response.data;
        return {
            success: true,
            data: processMonthlyStudioData(data),
            message: data.message || "Report data retrieved successfully!",
        };
    } catch (error) {
        console.error("Report data fetch error:", error);

        const message =
            error?.response?.data?.status?.statusMessage || "Failed to fetch dashboard data";
        return { success: false, message };
    }
};

function processMonthlyStudioData(rawData) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const monthlyLabels = [];
    const monthlyIncome = [];

    const expenseMap = {};
    const paymentAmountMap = {
        STUDENT: 0,
        CLIENT: 0,
    };

    rawData.data.forEach((entry) => {
        const monthIndex = entry.month - 1;
        const monthLabel = monthNames[monthIndex];
        monthlyLabels.push(monthLabel);
        monthlyIncome.push(entry.revenue ?? 0);

        // Aggregate expenses by category
        entry.expenseEntries.forEach((expense) => {
            const category = expense.expenseCategory || "OTHER";
            expenseMap[category] = (expenseMap[category] || 0) + (expense.amount ?? 0);
        });

        // Aggregate payment amounts by payee type
        entry.paymentEntries.forEach((payment) => {
            const payeeType = payment.payeeType?.toUpperCase();
            const amount = payment.amount ?? 0;
            if (payeeType) {
                paymentAmountMap[payeeType] = (paymentAmountMap[payeeType] || 0) + amount;
            }
        });
    });

    const expenseData = {
        labels: Object.keys(expenseMap),
        datasets: [
            {
                label: "Expenses",
                data: Object.values(expenseMap),
                backgroundColor: [
                    "rgba(244, 67, 54, 0.9)",
                    "rgba(3, 169, 244, 0.9)",
                    "rgba(255, 152, 0, 0.9)",
                    "rgba(139, 195, 74, 0.9)",
                    "rgba(63, 81, 181, 0.9)",
                    "rgba(156, 39, 176, 0.9)",
                ],
                hoverBackgroundColor: [
                    "rgba(244, 67, 54, 1)",
                    "rgba(3, 169, 244, 1)",
                    "rgba(255, 152, 0, 1)",
                    "rgba(139, 195, 74, 1)",
                    "rgba(63, 81, 181, 1)",
                    "rgba(156, 39, 176, 1)",
                ],
            },
        ],
    };

    const paymentData = {
        labels: Object.keys(paymentAmountMap),
        datasets: [
            {
                label: "Payment Amount by Type",
                data: Object.values(paymentAmountMap),
                backgroundColor: [
                    "rgba(33, 150, 243, 0.9)",
                    "rgba(255, 87, 34, 0.9)",
                    "rgba(255, 235, 59, 0.9)",
                ],
                hoverBackgroundColor: [
                    "rgba(33, 150, 243, 1)",
                    "rgba(255, 87, 34, 1)",
                    "rgba(255, 235, 59, 1)",
                ],
            },
        ],
    };

    const activityData = {
        labels: ["Dance", "Yoga", "Pilates", "Zumba", "Karate"],
        datasets: [
            {
                label: "Activity Participation",
                data: [50, 30, 20, 40, 25],
                backgroundColor: [
                    "rgba(255, 87, 34, 0.9)",
                    "rgba(255, 235, 59, 0.9)",
                    "rgba(76, 175, 80, 0.9)",
                    "rgba(33, 150, 243, 0.9)",
                    "rgba(156, 39, 176, 0.9)",
                ],
                hoverBackgroundColor: [
                    "rgba(255, 87, 34, 1)",
                    "rgba(255, 235, 59, 1)",
                    "rgba(76, 175, 80, 1)",
                    "rgba(33, 150, 243, 1)",
                    "rgba(156, 39, 176, 1)",
                ],
            },
        ],
    };

    return {
        ...getExpenseVsPaymentData(rawData),
        expenseData,
        paymentData,
        activityData,
    };
}

function getExpenseVsPaymentData(rawData) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const monthlyLabels = [];
    const monthlyExpenses = [];
    const monthlyPayments = [];

    rawData.data.forEach((entry) => {
        const monthIndex = entry.month - 1;
        const monthLabel = monthNames[monthIndex];
        monthlyLabels.push(monthLabel);

        const totalExpenses = entry.expenseEntries.reduce((sum, exp) => sum + exp.amount, 0);
        const totalPayments = entry.paymentEntries.reduce((sum, pay) => sum + pay.amount, 0);

        monthlyExpenses.push(totalExpenses);
        monthlyPayments.push(totalPayments);
    });

    const barData = {
        labels: monthlyLabels,
        datasets: [
            {
                label: "Payments",
                data: monthlyPayments,
                backgroundColor: "rgba(76, 175, 80, 0.7)",
                hoverBackgroundColor: "rgba(76, 175, 80, 1)",
            },
            {
                label: "Expenses",
                data: monthlyExpenses,
                backgroundColor: "rgba(244, 67, 54, 0.7)",
                hoverBackgroundColor: "rgba(244, 67, 54, 1)",
            },
        ],
    };

    const lineData = {
        labels: monthlyLabels,
        datasets: [
            {
                label: "Expenses",
                data: monthlyExpenses,
                borderColor: "rgba(244, 67, 54, 1)",
                backgroundColor: "rgba(244, 67, 54, 0.2)",
                tension: 0.4,
                fill: false,
            },
            {
                label: "Payments",
                data: monthlyPayments,
                borderColor: "rgba(76, 175, 80, 1)",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                tension: 0.4,
                fill: false,
            },
        ],
    };

    return { expenseVsPaymentBarData: barData, expenseVsPaymentLineData: lineData };
}
