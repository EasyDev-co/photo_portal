export function getNearestDate(dates) {

    // Парсинг входящего массива дат в объекты с deadline и theme_name
    const dateObjects = dates.map(date => {
        return {
            deadline: new Date(date.deadline),
            theme_name: date.photo_theme.name
        }
    });

    // Получение текущего времени
    const now = new Date();

    // Фильтрация дат, которые еще не наступили или наступили прямо сейчас
    const futureDates = dateObjects.filter(dateObj => dateObj.deadline.getTime() >= now.getTime());

    if (futureDates.length === 0) {
        // Если нет будущих дат, записываем пустое значение
        localStorage.setItem('deadline', '');
        localStorage.setItem('theme_name', '');
        return;
    }

    // Поиск ближайшей даты
    let closestDateObj = futureDates[0];
    futureDates.forEach(dateObj => {
        if (dateObj.deadline.getTime() < closestDateObj.deadline.getTime()) {
            closestDateObj = dateObj;
        }
    });

    // Запись ближайшей даты и темы в localStorage
    localStorage.setItem('deadline', closestDateObj.deadline.toISOString());
    localStorage.setItem('theme_name', closestDateObj.theme_name);
}