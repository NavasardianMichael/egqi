import { selectPercentile } from "store/settings/selectors";
import { useSelector, useDispatch } from 'react-redux'
import { setSettings } from "store/settings/actionCreators";

const Percentiles = () => {

    const dispatch = useDispatch()
    const percentile = useSelector(selectPercentile)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      dispatch(setSettings({percentile: Math.max(Math.min(+e.target.value, 15), 0)}))
    }

    return (
      <>
        <div className="form-outline" style={{width: 250}}>
            <label className="form-label" htmlFor="low-percentile">{`Percentiles low bound (<= 15)`}</label>
            <input 
                min="0" 
                max="15" 
                step="1" 
                type="number" 
                id="low-percentile" 
                className="form-control"
                placeholder="Percentiles up to 15%"
                value={percentile}
                onChange={handleChange}
            />
        </div>      
        <div className="form-outline" style={{width: 200}}>
            <label className="form-label" htmlFor="high-percentile">Percentiles high bound</label>
            <input
                disabled 
                min="0" 
                max="15" 
                step="1" 
                type="number" 
                id="high-percentile" 
                className="form-control"
                value={100 - percentile}
            />
        </div>      
      </>
    );
  }
  
  export default Percentiles;
  