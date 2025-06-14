
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
    
import { useAlert } from "../../../../utils/Alert";
import { useState } from 'react';

const CalendarView = () => {
    const showAlert = useAlert();

    const [value, setValue] = useState(new Date());

    return (
        <Calendar
            onChange={setValue}
            value={value}
        />
    );
};

export default CalendarView;
