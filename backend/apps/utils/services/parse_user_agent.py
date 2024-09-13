import re


def get_browser_name(user_agent) -> str:
    """Поиск имени браузера через регулярное выражение."""

    # Список из документации Т-банка для заполнения поля DeviceBrowser
    browsers = [
        "Chrome", "Yandex", "Firefox", "Opera", "Safari", "Microsoft Edge",
        "Miui", "JivoMobile", "Samsung", "WeChat", "WebKit"
    ]

    for browser in browsers:
        if re.search(browser, user_agent, re.IGNORECASE):
            return browser
    raise ValueError(f'Неизвестный браузер. Дополнительная информация: {user_agent}')


def parse_headers_to_get_data(headers, sber_pay='true', tinkoff_pay='true', web_view='true'):
    """Парсинг заголовков для формирования DATA для дополнительных способов оплаты."""
    data = {
        "SberPayWeb": sber_pay,
        "TinkoffPayWeb": tinkoff_pay,
        "Device": 'Mobile' if headers.get('sec-ch-ua-mobile')[-1] else 'Desktop',
        "DeviceOs": headers.get('sec-ch-ua-platform'),
        "DeviceWebView": web_view,
        "DeviceBrowser": get_browser_name(headers.get('user-agent')),
    }
    return data
