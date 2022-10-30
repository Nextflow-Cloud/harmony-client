export const formatTime = (time: Date) => {
    const isYesterday = (time: Date) => {
        const today = new Date();
        const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
        const date = new Date(time);
        return date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
    };

    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const currentDay = currentDate.getDate().toString().padStart(2, "0");
    const currentYear = currentDate.getFullYear().toString().padStart(4, "0");

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");

    const dateFormatted = `${month}/${day}/${year}`;
    const timeFormatted = `${hours}:${minutes}:${seconds}`;

    const currentDateFormatted = `${currentMonth}/${currentDay}/${currentYear}`;
    
    if (dateFormatted === currentDateFormatted) {
        return `Today at ${timeFormatted}`;
    } else if (isYesterday(time)) {
        return `Yesterday at ${timeFormatted}`;
    } 
    return `${dateFormatted} at ${timeFormatted}`;    
};
