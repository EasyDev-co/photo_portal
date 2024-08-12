import { useState, useCallback } from "react";

export function transformData(data) {
    const result = [];
    console.log(data)
    if (data.length !== 0) {


        const groupedByPhotoLineId = data.reduce((acc, item) => {

            const { photoLineId, is_photobook, is_digital, ...photo } = item;
            if (!acc[photoLineId]) {
                acc[photoLineId] = {
                    id: photoLineId ? photoLineId : photo.id,
                    photos: [],
                    is_photobook: is_photobook,
                    is_digital: is_digital
                };
            }

            if (photo.photo_type) {
                acc[photoLineId].photos.push(photo);
            }
            return acc;
        }, {});
        console.log(groupedByPhotoLineId)
        for (const key in groupedByPhotoLineId) {
            if (groupedByPhotoLineId.hasOwnProperty(key)) {
                result.push(groupedByPhotoLineId[key]);
            }
        }

    } 

    return result;
}
