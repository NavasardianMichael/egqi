import { generateIndicatorsExcelFile, generateIndicatorsRowsExcelFile, generateSummaryExcelFile, generateSummaryRowsExcelFile } from "helpers/functions/encoders";

export const DOWNLOAD_BUTTONS = [
    {
        id: 1,
        text: 'Download Summary',
        handler: generateSummaryExcelFile,
    },
    {
        id: 2,
        text: 'Download Summary (Rows)',
        handler: generateSummaryRowsExcelFile,
    },
    {
        id: 3,
        text: 'Download normalized values',
        handler: generateIndicatorsExcelFile,
    },
    {
        id: 4,
        text: 'Download normalized values (Rows)',
        handler: generateIndicatorsRowsExcelFile,
    },
]

export const INDICATOR_COLORS = [
    'rgba(255, 67, 67, 0.5)',
    'rgba(247, 247, 77, 0.877)',
    'rgba(87, 247, 87, 0.63)'
]