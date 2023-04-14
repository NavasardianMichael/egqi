import { generateIndicatorsExcelFile, generateOriginalIndicatorsExcelFile, generateSummaryByYearsColumnsExcelFile, generateSummaryByYearsRowsExcelFile, generateSummaryExcelFile } from "helpers/functions/encoders";

export const DOWNLOAD_BUTTONS = [
    {
        id: 1,
        text: 'Download Average Indices',
        handler: generateSummaryExcelFile,
    },
    {
        id: 2,
        text: 'Download Indices by Years (rows)',
        handler: generateSummaryByYearsRowsExcelFile,
    },
    {
        id: 3,
        text: 'Download Indices by Years (columns)',
        handler: generateSummaryByYearsColumnsExcelFile,
    },
    {
        id: 4,
        text: 'Download normalized indicators',
        handler: generateIndicatorsExcelFile,
    },
    {
        id: 5,
        text: 'Download original indicators',
        handler: generateOriginalIndicatorsExcelFile,
    },
]

export const INDICATOR_COLORS = [
    '#b50800bf',
    '#fff463',
    '#7bee77'
]