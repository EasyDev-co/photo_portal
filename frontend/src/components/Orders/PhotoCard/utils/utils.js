import { useState, useCallback } from "react";

export function transformData(data) {
    const result = [];

    const groupedByPhotoLineId = data.reduce((acc, item) => {
        
        const { photoLineId, is_photobook, is_digital, ...photo } = item;
        if (!acc[photoLineId]) {
            acc[photoLineId] = {
                id: photoLineId,
                photos: [],
                is_photobook: is_photobook,
                is_digital: is_digital
            };
        }
        console.log(photo.photo_type)
        if(photo.photo_type != 6){
            acc[photoLineId].photos.push(photo);
        } else {
            acc[photoLineId].photos.push();
        }  
        return acc;
    }, {});

    for (const key in groupedByPhotoLineId) {
        if (groupedByPhotoLineId.hasOwnProperty(key)) {
            result.push(groupedByPhotoLineId[key]);
        }
    }
    
    return result;
}
