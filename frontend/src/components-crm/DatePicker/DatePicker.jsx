import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import './style/DatePicker.scss';
import { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

function DatePicker({ value, setIsActive, placeholder, label, img, onDateChange, isModal, navTitles, userRole }) {
    let $input = useRef();
    let dp = useRef();

    const handleInputChange = (e) => {
        let dateValue = e.target.value.replace(/\D/g, '');

        if (dateValue.length > 2 && dateValue.length <= 4) {
            dateValue = `${dateValue.slice(0, 2)}.${dateValue.slice(2)}`;
        } else if (dateValue.length > 4) {
            dateValue = `${dateValue.slice(0, 2)}.${dateValue.slice(2, 4)}.${dateValue.slice(4, 8)}`;
        }

        if (onDateChange) {
            onDateChange(dateValue);
        }
    };

    useEffect(() => {
        dp.current = new AirDatepicker($input.current, {
            navTitles,
            onSelect({ date }) {
                const formattedDate = date.toLocaleDateString('ru-RU');
                onDateChange(formattedDate);
            },
        });

        return () => {
            dp.current.destroy();
        };
    }, [navTitles, onDateChange]);

    useEffect(() => {
        setIsActive(dp.current.visible);
    }, [setIsActive]);

    return (
        <div className="datepicker-wrap">
            <Form.Label
                className="text-secondary"
                style={isModal && {
                    fontSize: '12px',
                    fontWeight: '600',
                    paddingBottom: '16px',
                    margin: '0',
                }}
            >
                {label}
            </Form.Label>
            <Form.Control
                className="btn_filter shadow-none"
                id="datepicker"
                style={isModal && {
                    height: '38px',
                    padding: '8px 16px 8px 40px',
                }}
                placeholder={placeholder}
                ref={$input}
                value={value}
                onChange={handleInputChange}
                disabled={userRole === 2}
            />
            <div className="calendar-img">
                <img src={img} alt="" />
            </div>
        </div>
    );
}

export default DatePicker;


// import AirDatepicker from "air-datepicker";
// import "air-datepicker/air-datepicker.css";
// import './style/DatePicker.scss'
// import { useEffect, useRef } from "react";
// import { Form } from "react-bootstrap";


// function DatePicker(props) {
//     const { value, setIsActive, placeholder, label, img, onDateChange} = props;
//     let $input = useRef();
//     let dp = useRef();

//     const handleInputChange = (e) => {
//         let dateValue = e.target.value.replace(/\D/g, '');

//         if (dateValue.length > 2 && dateValue.length <= 4) {
//             dateValue = `${dateValue.slice(0, 2)}.${dateValue.slice(2)}`;
//         } else if (dateValue.length > 4) {
//             dateValue = `${dateValue.slice(0, 2)}.${dateValue.slice(2, 4)}.${dateValue.slice(4, 8)}`;
//         }

//         if (onDateChange) {
//             onDateChange(dateValue);
//         }
//     };
//     // Start init
//     useEffect(() => {
//         dp.current = new AirDatepicker($input.current, {
//             ...props,
//         });

//         // Очистка экземпляра datepicker при размонтировании
//         return () => {
//             dp.current.destroy();
//         };
//     }, []);


//     useEffect(() => {
//         // Update if props are changed
//         dp.current.update({ ...props });
//         // dp.current.$el.value = 'Дата'
//         setIsActive(dp.current.visible)
//     }, [props]);

//     return (
//         <div className="datepicker-wrap">
//             <Form.Label className="text-secondary" style={props.isModal && {
//                 fontSize: '12px',
//                 fontWeight: '600',
//                  paddingBottom: '16px',
//                  margin:'0'
//             }}>{label}</Form.Label>
//             <Form.Control 
//                 className="btn_filter shadow-none" 
//                 id="datepicker" 
//                 style={props.isModal && {
//                     height: '38px',
//                     padding: '8px 16px 8px 40px'
//                 }} 
//                 placeholder={placeholder} 
//                 ref={$input}
//                 value={value}
//                 onChange={handleInputChange} 
//             />
//             <div className="calendar-img">
//                 <img src={img} alt="" />
//             </div>
//         </div>
//     )
// }

// export default DatePicker;