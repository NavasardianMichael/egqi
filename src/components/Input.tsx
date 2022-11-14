import XLSX from "xlsx";

function Input() {

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0] as File
        const reader = new FileReader()


        reader.onload = (e) => {
            const data = e.target?.result
            const workbook = XLSX.read(data, {
                type: 'binary'
            })
           workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            console.log(rowObject)
           })

        }

        reader.readAsBinaryString(file)
    }

  return (
    <div className="my-3 w-75">
        <label htmlFor="formFile" className="form-label">
          We generate the index according to imported excel file with specific
          shape of data
        </label>
        <input onChange={handleChange} className="form-control" type="file" id="formFile" accept=".xlsx, .xls, .csv" />
    </div>
  );
}

export default Input;
