export const COL_NAMES = {
    country: 'country',
    eoqgi: 'eoqgi',
    eoqei: 'eoqei',
    eoqi: 'eoqi',
} as const

export const COL_NAMES_ORIGINAL = {
    [COL_NAMES.country]: 'country',
    [COL_NAMES.eoqgi]: 'EOQGI',
    [COL_NAMES.eoqei]: 'EOQEI',
    [COL_NAMES.eoqi]: 'EOQI',
} as const

export const COL_FULL_NAMES = {
    [COL_NAMES.country]: 'Country Name',
    [COL_NAMES.eoqgi]: 'Economic Output Quality Generation Index',
    [COL_NAMES.eoqei]: 'Economic Output Quality Effect Index',
    [COL_NAMES.eoqi]: 'Economic Output Quality Index',
} as const

export const INDICES_TYPES = [
    COL_NAMES.eoqgi,
    COL_NAMES.eoqei,
    COL_NAMES.eoqi,
] as const

export const STATS_TYPES = [
    COL_NAMES.eoqgi,
    COL_NAMES.eoqei,
    COL_NAMES.eoqi,
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
    [COL_NAMES.eoqgi]: {
        value: 1,
        ranking: 0
    },
    [COL_NAMES.eoqei]: {
        value: 1,
        ranking: 0
    },
    [COL_NAMES.eoqi]: {
        value: 1,
        ranking: 0
    },
}