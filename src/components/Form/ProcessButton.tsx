import { generateIndicatorsExcelFile, generateSummaryExcelFile } from "helpers/functions/encoders"
import { RootState } from "index"
import { useStore } from "react-redux"

export const ProcessButton = () => {
    const state = useStore<RootState>()
    const handleSummaryClick = () => {
        generateSummaryExcelFile(state.getState())
    }
    
    const handleIndicatorsClick = () => {
        generateIndicatorsExcelFile(state.getState())
    }
    return (
        <div className='d-flex justify-content-start justify-content-left' style={{gap: 20}}>
            <button onClick={handleSummaryClick} type="button" className="btn btn-primary">Download Summary</button>
            <button onClick={handleIndicatorsClick} type="button" className="btn btn-primary">Download Indicators</button>
        </div>
    )
}