export function getNearestDate(dates) {
    const dateObjects = dates.map(date => {
        return {
            deadline: new Date(date.deadline),
            theme_name: date.photo_theme.name
        }
    })

    const currentDate = new Date();

    let nearestDate = dateObjects[0].deadline;
    let minDiff = Math.abs(currentDate - dateObjects[0].deadline);
    
    for (let i = 1; i < dateObjects.length; i++) {
        const diff = Math.abs(currentDate - dateObjects[i].deadline);
        if (diff < minDiff) {
            minDiff = diff;
            nearestDate = {
                deadline: dateObjects[i].deadline,
                theme_name: dateObjects[i].theme_name
            }
        }
    }
    
    return nearestDate
}