export const combineClassNames = (classNames: string[]): string => {
    if(!classNames?.length) return ''
    return classNames.filter(className => !!className).join(' ')
}