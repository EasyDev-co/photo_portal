message_digital_photo = """
            <div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px 0;">
                    <h1 style="margin: 0; color: #000;">ФотоДетство</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 30px; text-align: center;">
                    <p style="font-size: 18px; color: #333;">
                        {first_name} {last_name}, вы приобрели фотографии в электронном виде.
                        Прилагаем их в этом письме. 
                    </p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        Также вы их можете скачать в личном кабинете в любое время.
                        Надеемся, что фотографии вам понравятся и вы останетесь довольны!
                    </p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5; margin-top: 20px;">
                        С любовью к вам и вашим детям ❤️
                        ФотоДетство ®
                    </p>
                </div>
            </div>
"""

message_is_digital_free = """
<div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px 0;">
        <h1 style="margin: 0; color: #fff;">ФотоДетство</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px;">
        <p style="font-size: 18px; color: #333; text-align: center;">
            {first_name} {last_name}, вы сделали заказ на сумму {price} рублей!
        </p>
        <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">
            В знак благодарности мы дарим вам доступ ко всем фотографиям в электронном виде совершенно бесплатно. 
            Вы можете скачать их, используя ссылки ниже.
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 30px;">
            {photo_links}
        </div>
        <p style="font-size: 16px; color: #555; text-align: center; margin-top: 30px;">
            Надеемся, что фотографии вам понравятся! Спасибо, что вы с нами ❤️
        </p>
        <p style="font-size: 14px; color: #aaa; text-align: center;">
            ФотоДетство ®
        </p>
    </div>
</div>
"""


message_is_calendar_free = """
<div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px 0;">
        <h1 style="margin: 0; color: #fff;">ФотоДетство</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 30px;">
        <p style="font-size: 18px; color: #333; text-align: center;">
            {first_name} {last_name}, вы сделали заказ на сумму {price} рублей!
        </p>
        <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">
            В благодарность мы подготовили для вас Календарь в подарок, а также предоставляем доступ ко всем фотографиям бесплатно!
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 30px;">
            {photo_links}
        </div>
        <p style="font-size: 16px; color: #555; text-align: center; margin-top: 30px;">
            Надеемся, что фотографии и календарь принесут вам радость! Спасибо, что вы с нами ❤️
        </p>
        <p style="font-size: 14px; color: #aaa; text-align: center;">
            ФотоДетство ®
        </p>
    </div>
</div>
"""

