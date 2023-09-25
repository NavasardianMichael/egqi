export const COL_NAMES = {
    country: 'country',
    egqgi: 'egqgi',
    egqei: 'egqei',
    egqi: 'egqi',
    erqigr: 'erqigr',
} as const

export const COL_FULL_NAMES = {
    [COL_NAMES.country]: 'Country Name',
    [COL_NAMES.egqgi]: 'Economic Growth Quality Generation Index',
    [COL_NAMES.egqei]: 'Economic Growth Quality Effect Index',
    [COL_NAMES.egqi]: 'Economic Growth Quality Index',
    [COL_NAMES.erqigr]: 'Economic Result Quality Index Growth Rate',
} as const

export const INDICES_TYPES = [
    COL_NAMES.egqgi,
    COL_NAMES.egqei,
    COL_NAMES.egqi,
] as const

export const STATS_TYPES = [
    COL_NAMES.egqgi,
    COL_NAMES.egqei,
    COL_NAMES.egqi,
    COL_NAMES.erqigr,
] as const

export const COL_SORT_TYPES = {
    0: 0,
    1: 1,
    2: 2,
} as const

export const SUBINDEX_TYPES = {
    0: 0,
    1: 1
}

export const INDICES_INITIALS = {
    [COL_NAMES.egqgi]: {
        value: 1,
        ranking: 0
    },
    [COL_NAMES.egqei]: {
        value: 1,
        ranking: 0
    },
    [COL_NAMES.egqi]: {
        value: 1,
        ranking: 0
    },
    [COL_NAMES.erqigr]: {
        value: 1,
        ranking: 0
    },
}