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