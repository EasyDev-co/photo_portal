from apps.photo.models.season import Seasons

seasons = {
    # Лето
    "летний": Seasons.SUMMER,
    "летнее": Seasons.SUMMER,
    "летняя": Seasons.SUMMER,
    "летние": Seasons.SUMMER,
    "лето": Seasons.SUMMER,
    "летом": Seasons.SUMMER,
    "лет": Seasons.SUMMER,
    "лету": Seasons.SUMMER,
    "лета": Seasons.SUMMER,
    "леточку": Seasons.SUMMER,
    "леточек": Seasons.SUMMER,
    "леточка": Seasons.SUMMER,
    "леточки": Seasons.SUMMER,

    # Осень
    "осенний": Seasons.AUTUMN,
    "осеннее": Seasons.AUTUMN,
    "осенняя": Seasons.AUTUMN,
    "осенние": Seasons.AUTUMN,
    "осень": Seasons.AUTUMN,
    "осенью": Seasons.AUTUMN,
    "осени": Seasons.AUTUMN,
    "осенек": Seasons.AUTUMN,
    "осенечки": Seasons.AUTUMN,

    # Зима
    "зимний": Seasons.WINTER,
    "зимнее": Seasons.WINTER,
    "зимняя": Seasons.WINTER,
    "зимние": Seasons.WINTER,
    "зима": Seasons.WINTER,
    "зиме": Seasons.WINTER,
    "зимой": Seasons.WINTER,
    "зимы": Seasons.WINTER,
    "зимушка": Seasons.WINTER,
    "зимушки": Seasons.WINTER,
    "зимушка-зима": Seasons.WINTER,
    "зимушка-зимушка": Seasons.WINTER,

    # Весна
    "весенний": Seasons.SPRING,
    "весеннее": Seasons.SPRING,
    "весенняя": Seasons.SPRING,
    "весенние": Seasons.SPRING,
    "весна": Seasons.SPRING,
    "весной": Seasons.SPRING,
    "весны": Seasons.SPRING,
    "веснушка": Seasons.SPRING,
    "веснушки": Seasons.SPRING,
    "весне": Seasons.SPRING,
}


def get_season(string: str) -> None | Seasons:
    words = string.lower().split(' ')
    possible_seasons = set()
    for word in words:
        season = seasons.get(word)
        if season:
            possible_seasons.add(season)

    if len(possible_seasons) != 1:
        return None
    return possible_seasons.pop()
