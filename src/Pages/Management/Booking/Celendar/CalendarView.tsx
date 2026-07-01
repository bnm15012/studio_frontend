import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useState } from "react";

const CalendarView = () => {
    const [value, setValue] = useState(new Date());

    return <Calendar onChange={setValue} value={value} />;
};

export default CalendarView;
