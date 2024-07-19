export function transformData(data,digital) {
    const result = [];

    const groupedByPhotoLineId = data.reduce((acc, item) => {
        const { photoLineId, is_photobook, ...photo } = item;
        if (!acc[photoLineId]) {
            acc[photoLineId] = {
                id: photoLineId,
                photos: [],
                is_photobook: is_photobook,
                is_digital: digital
            };
        }
        acc[photoLineId].photos.push(photo);
        return acc;
    }, {});

    for (const key in groupedByPhotoLineId) {
        if (groupedByPhotoLineId.hasOwnProperty(key)) {
            result.push(groupedByPhotoLineId[key]);
        }
    }

    return result;
}
