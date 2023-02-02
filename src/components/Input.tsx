import { processIndices, processWorkbookData } from "helpers/functions/processors";
import XLSX from "xlsx";

function Input() {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] as File;
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, {
        type: 'binary',
      });
      
      processIndices(processWorkbookData(workbook))
      
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="my-3">
      <div>
        <label htmlFor="formFile" className="form-label">
          We generate the index according to imported excel file with specific
          shape of data
        </label>
        <input
          onChange={handleChange}
          className="form-control w-100"
          style={{ maxWidth: "300px" }}
          type="file"
          id="formFile"
          accept=".xlsx, .xls, .csv"
        />
      </div>
      <div className="form-outline mt-4" style={{maxWidth: 100}}>
          <label className="form-label" htmlFor="typeNumber">Number input</label>
          <input min="0" max="15" step="1" type="number" id="typeNumber" className="form-control" />
      </div>
    </div>
  );
}

export default Input;
