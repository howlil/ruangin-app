const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const checkTimeRange = (value, helpers) => {
    const time = value.split(':');
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);

    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60;  
    const endMinutes = 17 * 60;   

    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
        return helpers.message('jam harus diantara 07:00 dan 17:00');
    }

    return value;
};

const validateDate = (value, helpers) => {
    if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
        return helpers.error('date.invalid');
    }

    const date = dayjs(value);
    const dayOfWeek = date.day();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return helpers.error('date.workingDay');
    }

    if (date.isBefore(dayjs(), 'day')) {
        return helpers.error('date.past');
    }

    return value;
};

module.exports = {checkTimeRange,validateDate}