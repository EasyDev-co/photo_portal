/* eslint-disable react/prop-types */
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import './style/DatePicker.scss'
import { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import calendar from '../../assets/icons/calendar-event.svg'

function DatePicker(props) {

    let $input = useRef();
    let dp = useRef();
    // Start init
    useEffect(() => {
        // Save instance for the further update
        dp.current = new AirDatepicker($input.current, { ...props });
    }, []);

    useEffect(() => {
        // Update if props are changed
        dp.current.update({ ...props });
        // dp.current.$el.value = 'Дата'
        props.setIsActive(dp.current.visible)
    }, [props]);

    return (
        <div className="datepicker-wrap">
            <Form.Label>{props.label}</Form.Label>
            <Form.Control className="btn_filter shadow-none" id="datepicker" placeholder={props.placeholder} ref={$input} />
            <div className="calendar-img">
                <img src={calendar} alt="" />
            </div>
        </div>
    )
}

export default DatePicker;