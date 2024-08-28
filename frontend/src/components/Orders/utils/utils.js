export function getNearestDate(dates) {
    const dateObjects = dates.map(date => new Date(date.deadline));
    
    const currentDate = new Date();

    let nearestDate = dateObjects[0];
    let minDiff = Math.abs(currentDate - dateObjects[0]);
    
    for (let i = 1; i < dateObjects.length; i++) {
        const diff = Math.abs(currentDate - dateObjects[i]);
        if (diff < minDiff) {
            minDiff = diff;
            nearestDate = dateObjects[i];
        }
    }
    
    return nearestDate;
}