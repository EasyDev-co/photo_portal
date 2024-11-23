from apps.photo.models.season import Seasons

seasons = {
    # Лето
    "летний": Seasons.SUMMER.label,
    "летнее": Seasons.SUMMER.label,
    "летняя": Seasons.SUMMER.label,
    "летние": Seasons.SUMMER.label,
    "лето": Seasons.SUMMER.label,
    "летом": Seasons.SUMMER.label,
    "лет": Seasons.SUMMER.label,
    "лету": Seasons.SUMMER.label,
    "лета": Seasons.SUMMER.label,
    "леточку": Seasons.SUMMER.label,
    "леточек": Seasons.SUMMER.label,
    "леточка": Seasons.SUMMER.label,
    "леточки": Seasons.SUMMER.label,

    # Осень
    "осенний": Seasons.AUTUMN.label,
    "осеннее": Seasons.AUTUMN.label,
    "осенняя": Seasons.AUTUMN.label,
    "осенние": Seasons.AUTUMN.label,
    "осень": Seasons.AUTUMN.label,
    "осенью": Seasons.AUTUMN.label,
    "осени": Seasons.AUTUMN.label,
    "осенек": Seasons.AUTUMN.label,
    "осенечки": Seasons.AUTUMN.label,

    # Зима
    "зимний": Seasons.WINTER.label,
    "зимнее": Seasons.WINTER.label,
    "зимняя": Seasons.WINTER.label,
    "зимние": Seasons.WINTER.label,
    "зима": Seasons.WINTER.label,
    "зиме": Seasons.WINTER.label,
    "зимой": Seasons.WINTER.label,
    "зимы": Seasons.WINTER.label,
    "зимушка": Seasons.WINTER.label,
    "зимушки": Seasons.WINTER.label,
    "зимушка-зима": Seasons.WINTER.label,
    "зимушка-зимушка": Seasons.WINTER.label,

    # Весна
    "весенний": Seasons.SPRING.label,
    "весеннее": Seasons.SPRING.label,
    "весенняя": Seasons.SPRING.label,
    "весенние": Seasons.SPRING.label,
    "весна": Seasons.SPRING.label,
    "весной": Seasons.SPRING.label,
    "весны": Seasons.SPRING.label,
    "веснушка": Seasons.SPRING.label,
    "веснушки": Seasons.SPRING.label,
    "весне": Seasons.SPRING.label,
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
