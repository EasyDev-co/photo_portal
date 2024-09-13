import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const chartRef = useRef(null);

    const getGradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(110, 223, 246, 1)'); // Зеленый
        gradient.addColorStop(0.5, 'rgba(110, 223, 246, 1)'); // Зеленый на 50%
        gradient.addColorStop(0.5001, 'rgba(99, 102, 241, 1)'); // Красный сразу после 50%
        gradient.addColorStop(1, 'rgba(99, 102, 241, 1)'); // Красный
        return gradient;
    };

    const data = {
        labels: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'А', 'С', 'О'],
        datasets: [
            {
                label: 'Количество детских садов',
                data: [12, 19, 3, 5, 2, 3, 8, 15, 10], // Пример данных
                backgroundColor: (ctx) => {
                    const canvas = chartRef.current?.canvas;
                    if (canvas) {
                        const context = canvas.getContext('2d');
                        return getGradient(context);
                    }
                    return 'rgba(76, 175, 80, 1)'; // Запасной цвет
                },
                barThickness: 10,
                borderRadius: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ростов - Количество детских садов в 2024',
            },
        },
    };

    useEffect(() => {
        const ctx = chartRef.current?.ctx;
        if (ctx) {
            // Обновляем диаграмму для применения градиента
            chartRef.current.update();
        }
    }, []);

    return <Bar ref={chartRef} data={data} options={options} />;
};

export default BarChart;