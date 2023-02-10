import FileInput from "components/Form/FileInput";
import Output from "components/Output/Output";
import { ProcessButton } from "./ProcessButton";

const Form = () => {
  return (
    <div className="d-flex mt-3 flex-column" style={{gap: 30}}>
      <FileInput />
      <ProcessButton />
      <Output />
    </div>
  );
}

export default Form;
