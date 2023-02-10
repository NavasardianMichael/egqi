import { generateIndicatorsExcelFile, generateIndicatorsRowsExcelFile, generateSummaryExcelFile, generateSummaryRowsExcelFile } from "helpers/functions/encoders"
import { RootState } from "index"
import { useStore } from "react-redux"

export const ProcessButton = () => {
    const { getState } = useStore<RootState>()
    const state = getState() 
    const handleSummaryClick = () => {
        generateSummaryExcelFile(state)
    }

    const handleSummaryRowsClick = () => {
        generateSummaryRowsExcelFile(state)
    }
    
    const handleIndicatorsClick = () => {
        generateIndicatorsExcelFile(state)
    }

    const handleIndicatorsRowsClick = () => {
        generateIndicatorsRowsExcelFile(state)
    }
    return (
        <div className='d-flex justify-content-start justify-content-left' style={{gap: 20}}>
            <button onClick={handleSummaryClick} type="button" className="btn link-primary">Download Summary</button>
            <button onClick={handleSummaryRowsClick} type="button" className="btn btn-primary">Download Summary (Rows)</button>
            <button onClick={handleIndicatorsClick} type="button" className="btn btn-primary">Download Indicators</button>
            <button onClick={handleIndicatorsRowsClick} type="button" className="btn btn-primary">Download Indicators (rows)</button>
        </div>
    )
}