const getMonthName = (monthIndex) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
};

// Function to generate options for the select dropdown
export const generateOptions = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of the year

    const options = [];
    for (let i = 0; i <= 10; i++) {
        const previousMonthIndex = (currentMonth - i + 12) % 12;
        let previousYear = currentYear;
        if (previousMonthIndex > currentMonth) {
            // If the previous month is in the previous year
            previousYear = currentYear - 1;
        }
        const monthName = getMonthName(previousMonthIndex);
        options.push({
            value: `${previousMonthIndex + 1}/${previousYear}`,
            label: `${monthName} ${previousYear}`,
        });
    }
    return options;
};
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};