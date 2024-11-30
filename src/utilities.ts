export const formatTime = (timestamp: Date) => {
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();
    const day = timestamp.getDate();
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    const currentTime = new Date();
    if (year === currentTime.getFullYear() && month === currentTime.getMonth() && day === currentTime.getDate()) {
        return `${hours}:${minutes}`;
    }
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}