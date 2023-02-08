import { processWorkbookData } from "helpers/functions/processors";
import XLSX from "xlsx";

function FileInput() {
  
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] as File;
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, {
        type: 'binary',
      });
      
      const processedData = processWorkbookData(workbook)
      console.log({processedData})
      // dispatch(setLists(processedData.lists))
      // dispatch(setValues(processedData.values))
      // dispatch(setSettings(processedData.settings))
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-3">
      <div>
        <label htmlFor="formFile" className="form-label">
          File
        </label>
        <input
          onChange={handleChange}
          className="form-control w-100"
          style={{ maxWidth: 250 }}
          type="file"
          id="formFile"
          accept=".xlsx, .xls, .csv"
        />
      </div>
    </div>
  );
}

export default FileInput;
