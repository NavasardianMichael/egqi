import { DOWNLOAD_BUTTONS } from "helpers/constants.ts/output"
import { RootState } from "index"
import { useSelector, useStore } from "react-redux"
import { selectYears } from "store/years/selectors"

export const DownloadButtons = () => {
    const { getState } = useStore<RootState>()
    const state = getState()
    const years = useSelector(selectYears)

    if(!years?.length) return null

    return (
        <div className='d-flex justify-content-start justify-content-left my-4' style={{gap: 20}}>
            {
                DOWNLOAD_BUTTONS.map(button => {
                    return (
                        <a 
                            key={button.id}
                            type="button" 
                            className="link-secondary"
                            onClick={() => button.handler(state)}
                        >
                            {button.text}
                        </a>
                    )
                })
            }
        </div>
    )
}