export const COL_NAMES = {
    country: 'country',
    egqgi: 'egqgi',
    egqei: 'egqei',
    egqi: 'egqi',
    egqemr: 'egqemr',
} as const

export const INDICES_TYPES = [
    COL_NAMES.egqgi,
    COL_NAMES.egqei,
    COL_NAMES.egqi,
]

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
    [COL_NAMES.egqgi]: 0,
    [COL_NAMES.egqei]: 0,
    [COL_NAMES.egqi]: 0,
    [COL_NAMES.egqemr]: 0,
}