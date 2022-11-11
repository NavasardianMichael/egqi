function Input() {

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const reader = new FileReader()

        reader.readAsArrayBuffer(e.target)
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
