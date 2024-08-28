export function transformData(data) {
    const result = [];

    if (data.length !== 0) {

        // Здесь мы просто из orderValue получаем массив с кучей ID и photoLineId 
        // Далее мы преобразовываем этот неупорядоченный массив в нормальный 
        // ТО есть мы все что с одинаковым photoLineId закидываем в 1 объект 
        const groupedByPhotoLineId = data.reduce((acc, item) => {
            const { photoLineId, is_photobook, is_digital, promo_code, ...photo } = item;
            const id = photoLineId ? photoLineId : photo.id;

            if (!acc[id]) {
                acc[id] = {
                    id: id,
                    photos: [],
                    is_photobook: is_photobook,
                    is_digital: is_digital,
                    promo_code: promo_code
                };
            } else {
                acc[id].is_photobook = acc[id].is_photobook || is_photobook;
                acc[id].is_digital = acc[id].is_digital || is_digital;
            }
            if(acc[id].promo_code === ''){
                delete acc[id].promo_code;
            }
            if (photo.photo_type) {
                acc[id].photos.push(photo);
            }

            return acc;
        }, {});

        // Это преобразование в массив 
        // То есть reduce преобразовывал по типу: ["g34g3ger": {}] для того чтоб все одинаковые photoLineId собрать в единый объект 
        // А становится [{}, {}, {}] как и нужно для API 
        for (const key in groupedByPhotoLineId) {
            if (groupedByPhotoLineId.hasOwnProperty(key)) {
                result.push(groupedByPhotoLineId[key]);
            }
        }
    }

    return result;
}