import FileInput from "components/Form/FileInput";
import { ProcessButton } from "./ProcessButton";

const Form = () => {
  return (
    <div className="d-flex align-items-center mt-3 flex-wrap" style={{gap: 30}}>
      <FileInput />
      {/* <Percentiles /> */}
      {/* <Weights /> */}
      <ProcessButton />
    </div>
  );
}

export default Form;
