import pencil from '../assets/icons/pencil.svg';
import print from '../assets/icons/file-image.svg';
import cart from '../assets/icons/cart.svg';
import chat from '../assets/icons/chat-square-dots.svg';
import task from '../assets/icons/list-task.svg';
import role from '../assets/icons/person-bounding-box.svg';
import cash from '../assets/icons/cash.svg';
import franchies from '../assets/icons/file-person.svg';

export const usersLinks = [
    {
        to: '/design',
        value: 'Дизайн',
        image: pencil,

    },
    {
        to: '/print',
        value: 'Печать',
        image: print
    },
    {
        to: '/delivery',
        value: 'Доставка',
        image: cart
    },
    {
        to: '/franchises',
        value: 'Франшизы',
        image: franchies
    }
]

export const othersLinks = [
    {
        to: '/tasks',
        value: 'Задачи',
        image: task
    },
    {
        to: '/chat',
        value: 'Чат',
        image: chat
    }
]

export const settingsLinks = [
    {
        to: '/roles',
        value: 'Задачи',
        image: role
    },
    {
        to: '/prices',
        value: 'Цены',
        image: cash
    }
]
