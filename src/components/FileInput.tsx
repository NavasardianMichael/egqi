import { useDispatch, useSelector } from "react-redux";
import XLSX from "xlsx";
import { processWorkbookData } from "helpers/functions/decoders";
import { setCountriesState } from "store/countries/actionCreators";
import { setIndicators } from "store/indicators/actionCreators";
import { setIndices } from "store/indices/actionCreators";
import { setYears } from "store/years/actionCreators";
import { selectIndicators } from "store/indicators/selectors";

function FileInput() {
  
  const dispatch = useDispatch()
  const indicators = useSelector(selectIndicators)

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleExcelFile(e.target.files?.[0] as File)
  };

  const handleExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, {
        type: 'binary',
      });
      
      const output = processWorkbookData(workbook)
      
      const { countries, indicators, indices, years } = output
      dispatch(setCountriesState(countries))
      dispatch(setIndicators(indicators))
      dispatch(setYears(years))
      dispatch(setIndices(indices))
    };

    reader.readAsBinaryString(file);
  }

  if(indicators.allNames.length) return null

  return (
    <div data-testid='file'>
      <div>
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
