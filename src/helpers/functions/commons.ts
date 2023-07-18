export const combineClassNames = (classNames: string[]): string => {
    if(!classNames?.length) return ''
    return classNames.filter(className => !!className).join(' ')
}

export const geoMean = (...list: number[]) => {
    if(!list.length) throw new Error('Numbers are not provided for geomean calculation')
    
    const num = list.reduce((result, member) => {
        result *= member
        return result
    }, 1)

    const value = Math.pow(num, 1/list.length)
    return value
}