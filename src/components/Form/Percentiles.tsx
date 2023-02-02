const Percentiles = () => {
    return (
      <div className="form-outline" style={{maxWidth: 200}}>
            <label className="form-label" htmlFor="typeNumber">Percentiles</label>
            <input 
                min="0" 
                max="15" 
                step="1" 
                type="number" 
                id="typeNumber" 
                className="form-control" 
            />
      </div>
    );
  }
  
  export default Percentiles;
  