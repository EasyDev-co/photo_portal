import logo from "../assets/images/logo.svg";
import bagIcon from "../assets/images/SideBarIcons/bag.svg";
import imageIcon from "../assets/images/SideBarIcons/image.svg";
import profileIcon from "../assets/images/SideBarIcons/profile.svg";
import infoIcon from "../assets/images/SideBarIcons/info.svg";
import rulesIcon from "../assets/images/SideBarIcons/rules.svg";
import exitIcon from "../assets/images/SideBarIcons/exit.svg";
import vkIcon from "../assets/images/socials/vk.svg";
import whatsAppIcon from "../assets/images/socials/WhatsApp.svg";
import telegramIcon from "../assets/images/socials/telegram.svg";
import aboutUsFirst from "../assets/images/AboutUsPhotos/PhotoG.jpg";
import aboutUsSecond from "../assets/images/AboutUsPhotos/PhotoM.jpg";
import quotesIcon from "../assets/images/quotes.svg";


const userInfo = {
  surname: "Иванова",
  name: "Ольга",
  patronymic: "Игоревна",
  tel: "+7 916 555 55 55",
  country: "Россия",
  city: "Ростов-на-Дону",
  kindergarten: "Детский сад “Ромашка”",
};
const userInfoProfile = {
  surname: "Иванова",
  name: "Ольга",
  patronymic: "Игоревна",
  tel: "+7 916 555 55 55",
  country: "Россия",
  city: "Ростов-на-Дону",
  kindergarten: "Детский сад “Ромашка”",
  email: "bobik228@mail.ru",
  password:"12asd345!678910"
};
const rulesItems = [
  {
    num: "1.",
    text: "Делая заказ, вы автоматически создаете личный кабинет. Никто кроме вас не сможет просмотреть данные фотографии, не зайдя в ваш личный кабинет.",
  },
  {
    num: "2.",
    text: "Все фотографии хранятся у нас на сервере. В любой момент вы можете зайти в личный кабинет и скачать их.",
  },
  {
    num: "3.",
    text: "Сделать заказ вы можете в ограниченный период времени (в среднем, 7 дней). Период, в течении которого вы сможете сделать заказ, видно на странице заказа. Если вы видите надпись «Срок создания заказа истек», значит вы не сможете произвести оплату, и в таком случае, фотографии со всего сада будут автоматически удалены с сервера.",
  },
  {
    num: "4.",
    text: "После оплаты заказа, если электронная версия фотографий входит в стоимость, на указанный электронный адрес будут высланы фотографии.",
  },
  {
    num: "5.",
    text: "Фотографии будут отправлены в печать и высланы курьером в детский сад после того, как истечет отложенное на это время.",
  },
];

const aboutUsItems = [
  {
    photo: aboutUsFirst,
    text: "С 2016 года мы радуем наших клиентов качественными фотографиями, которые остаются яркими и красочными на протяжении десятилетий. Мы гордимся тем, что наши работы становятся настоящими семейными ценностями и передают тепло и радость поколениям.",
    icon: quotesIcon,
    iconAlt: "кавычки",
    infoAltPhoto: "фото ребёнка",
  },
  {
    photo: aboutUsSecond,
    text: "Наша компания - это не просто фотостудия, мы создаем настоящие волшебные моменты, которые останутся в памяти на долгие годы. Мы делаем вклад в сохранение памяти о детстве, захватывая его яркими и неповторимыми образами.",
    icon: quotesIcon,
    iconAlt: "кавычки",
    infoAltPhoto: "фото ребёнка",
  },
];

export {
  logo,
  bagIcon,
  imageIcon,
  profileIcon,
  infoIcon,
  rulesIcon,
  exitIcon,
  vkIcon,
  whatsAppIcon,
  telegramIcon,
  userInfo,
  rulesItems,
  aboutUsItems,
  userInfoProfile
};
