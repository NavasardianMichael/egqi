import XLSX from "xlsx";

export const processWorkbookData = (workbook: XLSX.WorkBook) => {
    workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log(rowObject);
    });
    return workbook
}