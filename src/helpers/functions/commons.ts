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

export const generateOrdinalNumber = (num: number): string => {
    if(!num) return '';
    
    const numStr = num.toString()
    if(numStr[numStr.length - 1] === '1') return num + 'st'
    if(numStr[numStr.length - 1] === '2') return num + 'nd'
    if(numStr[numStr.length - 1] === '3') return num + 'rd'
    return num + 'th'
}