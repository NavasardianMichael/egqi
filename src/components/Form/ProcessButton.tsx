import { DOWNLOAD_BUTTONS } from "helpers/constants.ts/output"
import { RootState } from "index"
import { useSelector, useStore } from "react-redux"
import { selectYears } from "store/years/selectors"

export const ProcessButton = () => {
    const { getState } = useStore<RootState>()
    const state = getState()
    const years = useSelector(selectYears)

    if(!years?.length) return null

    return (
        <div className='d-flex justify-content-start justify-content-left' style={{gap: 20}}>
            {
                DOWNLOAD_BUTTONS.map(button => {
                    return (
                        <button 
                            key={button.id}
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => button.handler(state)}
                        >
                            {button.text}
                        </button>
                    )
                })
            }
        </div>
    )
}