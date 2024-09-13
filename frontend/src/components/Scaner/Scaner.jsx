/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './Scaner.module.css'
import { useState, useEffect } from 'react';

import { Html5Qrcode } from 'html5-qrcode';
import { useDispatch } from 'react-redux';
import { addQrIdPhoto } from '../../store/authSlice';

const Scaner = ({ scanActive, setScanActive, isAuth }) => {
    const dispatch = useDispatch();
    const [qrMessage, setQrMessage] = useState('');
    useEffect(() => {
        const config = {
            fps: 10,
            qrbox: {
                width: 400,
                height: 400
            }
        }
        const html5QrCode = new Html5Qrcode('qrCodeContainer');

        const qrScannerStop = () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop();
            }
        }
        
        const qrCodeSuccess = (decodeTxt) => {
            if(!isAuth){
                window.location.href = decodeTxt;
            }
            setQrMessage(decodeTxt);
            setScanActive(false);
            const url = new URL(decodeTxt);
            const params = new URLSearchParams(url.search);
            dispatch(addQrIdPhoto(params.get('photo_line_id')))

        }
        if (scanActive) {
            html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess)
            setQrMessage('')
        } else {
            qrScannerStop();
        }
        return (() => {
            qrScannerStop()
        })
    }, [scanActive])

    return (
        <div onClick={() => setScanActive(false)} className={scanActive ? styles.scanerActive : styles.scaner}>
            <div id='qrCodeContainer' ></div>
        </div>
    );
}

export default Scaner;