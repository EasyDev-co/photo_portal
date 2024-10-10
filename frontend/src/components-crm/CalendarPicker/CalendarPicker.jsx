import AirDatepicker from "air-datepicker";
import { useEffect, useRef } from "react";
import './style/CalendarPicker.scss'

const CalendarPicker = (props) => {
    let $input = useRef();
    let dp = useRef();

    // Инициализация datepicker при первой загрузке компонента
    useEffect(() => {
        dp.current = new AirDatepicker($input.current, {
            ...props,
        });

        // Очистка экземпляра datepicker при размонтировании
        return () => {
            dp.current.destroy();
        };
    }, []);

    useEffect(() => {
        dp.current.update({ ...props });
        props.setIsActive(dp.current.visible);
    }, [props]);

    return (
        <div className="calendarpicker-wrap" ref={$input}></div>
    );
};

export default CalendarPicker;