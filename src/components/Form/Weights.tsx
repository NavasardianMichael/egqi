import { useSelector, useDispatch } from 'react-redux'
import { selectWeights } from "store/settings/selectors"

export const Weights = () => {
    const dispatch = useDispatch()
    console.log(dispatch);
    
    const weights = useSelector(selectWeights)
    console.log(weights);
    
    return (
        <div className='w-100'>
            <h1>68</h1>
        </div>
    )
}