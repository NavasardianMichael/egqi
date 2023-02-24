import { generateIndicatorsExcelFile, generateSummaryByYearsColumnsExcelFile, generateSummaryByYearsRowsExcelFile, generateSummaryExcelFile } from "helpers/functions/encoders";

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
]

export const INDICATOR_COLORS = [
    'rgba(255, 67, 67, 0.5)',
    'rgba(247, 247, 77, 0.877)',
    'rgba(87, 247, 87, 0.63)'
]