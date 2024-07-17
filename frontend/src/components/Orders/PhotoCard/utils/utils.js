const collectFormData = () => {
    const forms = document.querySelectorAll('form'); // Получаем все формы на странице
    const formDataArray = [];

    forms.forEach(form => {
        const formData = {
            id: form.id,
            data: {},
        };
        
        // Проходим по всем элементам формы
        Array.from(form.elements).forEach(element => {
            if (element.name) {
                formData.data[element.name] = element.value;
            }
        });
        
        formDataArray.push(formData);
    });
    
    return formDataArray;
};