import FileInput from "components/FileInput";
import IndicesTab from "components/IndicesTab/IndicesTab";
import ModelTab from "./ModelTab/ModelTab";
import { useSelector } from "react-redux";
import { selectAppState } from "store/app/selectors";
import { Spinner } from "./Spinner/Spinner";
import VisualizationTab from "./VisualizationTab/VisualizationTab";

const Content = () => {
  const { isProcessing } = useSelector(selectAppState);

  return (
    <div className="d-flex flex-column p-3" style={{ gap: 30 }}>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            disabled={isProcessing}
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            Index
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            disabled={isProcessing}
            className="nav-link"
            id="visualization-tab"
            data-bs-toggle="tab"
            data-bs-target="#visualization"
            type="button"
            role="tab"
            aria-controls="visualization"
            aria-selected="false"
          >
            Visualization
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            disabled={isProcessing}
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile"
            type="button"
            role="tab"
            aria-controls="profile"
            aria-selected="false"
          >
            Model
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          {isProcessing ? (
            <Spinner />
          ) : (
            <>
              <FileInput />
              <IndicesTab />
            </>
          )}
        </div>
        <div
          className="tab-pane fade show"
          id="visualization"
          role="tabpanel"
          aria-labelledby="visualization-tab"
        >
          {isProcessing ? <Spinner /> : <VisualizationTab />}
        </div>
        <div
          className="tab-pane fade"
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <ModelTab />
        </div>
      </div>
    </div>
  );
};

export default Content;
