import FileInput from "components/Input";
import Percentiles from "./Percentiles";

const Form = () => {
  return (
    <div className="d-flex align-items-center" style={{gap: 30}}>
        <FileInput />
        <Percentiles />
    </div>
  );
}

export default Form;
