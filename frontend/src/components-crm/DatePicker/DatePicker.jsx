/* eslint-disable react/prop-types */
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import './style/DatePicker.scss'
import { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";


function DatePicker(props) {
    const {setIsActive, placeholder, label, img} = props;
    let $input = useRef();
    let dp = useRef();
    // Start init
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
        // Update if props are changed
        dp.current.update({ ...props });
        // dp.current.$el.value = 'Дата'
        setIsActive(dp.current.visible)
    }, [props]);

    return (
        <div className="datepicker-wrap">
            <Form.Label className="text-secondary" style={props.isModal && {
                fontSize: '12px',
                fontWeight: '600',
                 paddingBottom: '16px',
                 margin:'0'
            }}>{label}</Form.Label>
            <Form.Control className="btn_filter shadow-none" id="datepicker" style={props.isModal && {
                height: '38px',
                padding: '8px 16px 8px 40px'
            }} placeholder={placeholder} ref={$input} />
            <div className="calendar-img">
                <img src={img} alt="" />
            </div>
        </div>
    )
}

export default DatePicker;