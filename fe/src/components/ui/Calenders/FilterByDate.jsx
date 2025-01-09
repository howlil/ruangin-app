import * as React from "react";
import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { X } from "lucide-react";

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isInRange" && prop !== "isSelected",
})(({ theme, isInRange, isSelected }) => ({
  margin: "0.05rem",
  borderRadius: 4,
  ...(isInRange && {
    backgroundColor: "#D6EAFF",
    color: "#308CEF",
    "&:hover, &:focus": {
      backgroundColor: "#308CEF",
      color: "#D6EAFF",
    },
  }),
  ...(isSelected && {
    backgroundColor: "#308CEF",
    color: "#D6EAFF",
    "&:hover, &:focus": {
      backgroundColor: "#308CEF",
      color: "#D6EAFF",
    },
  }),
}));

function Day(props) {
  const { day, startDate, endDate, onDayClick, ...other } = props;

  const isSelected = day.isSame(startDate, "day") || day.isSame(endDate, "day");
  const isInRange =
    startDate && endDate && day.isBetween(startDate, endDate, null, "[]");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isSelected}
      isInRange={isInRange}
      onClick={() => onDayClick(day)}
    />
  );
}

export default function FilterByDate({
  selectedDate,
  setSelectedDate,
  onClose,
}) {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const handleDayClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (day.isBefore(startDate)) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const handleConfirm = () => {
    if (startDate) {
      const selectedDates = {
        start_date: startDate.format("YYYY-MM-DD"),
        ...(endDate && { end_date: endDate.format("YYYY-MM-DD") }),
      };
      setSelectedDate(selectedDates); 
      onClose(); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <section className="p-6 shadow-lg rounded-xl relative bg-white">
        <div className="flex justify-between pb-4 items-center">
          <h1 className="text-xl font-semibold">Select Date Range</h1>
          <button
            className="text-gray-700 hover:text-gray-900"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <div className="border-y">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={startDate || endDate}
              onChange={() => {}} 
              showDaysOutsideCurrentMonth
              slots={{ day: Day }}
              slotProps={{
                day: (ownerState) => ({
                  startDate,
                  endDate,
                  onDayClick: handleDayClick,
                }),
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-primary hover:bg-blue-800 tc text-white rounded-md px-4 py-2"
            onClick={handleConfirm}
            disabled={!startDate}
          >
            Confirm
          </button>
        </div>
      </section>
    </div>
  );
}
