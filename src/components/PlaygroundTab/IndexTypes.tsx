import { INDICES_TYPES } from "helpers/constants.ts/indices";
import { Fragment, MouseEventHandler, memo } from "react";
import { T_Indices } from "store/indices/types";
// import styles from "./modelTab.module.css";

type Props = {
  selectedIndexTypeState: [
    keyof T_Indices,
    React.Dispatch<React.SetStateAction<keyof T_Indices>>
  ];
};

function IndexTypes({ selectedIndexTypeState }: Props) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    selectedIndexTypeState[1](e.currentTarget.name as keyof T_Indices);
  };

  return (
    <div>
      <label htmlFor="exampleInputEmail1" className="mb-2">
        Select Index Type
      </label>
      <div className="dropdown" id="exampleInputEmail1">
        <button
          className={`btn btn-light dropdown-toggle ${
            selectedIndexTypeState[0] && "text-uppercase"
          }`}
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          data-toggle="dropdown"
        >
          {selectedIndexTypeState[0]}
        </button>
        <div className="dropdown-menu " aria-labelledby="dropdownMenuButton1">
          {INDICES_TYPES.map((indexType, index, list) => {
            return (
              <Fragment key={indexType}>
                <button
                  type="button"
                  name={indexType}
                  onClick={handleClick}
                  className="dropdown-item text-uppercase"
                >
                  {indexType}
                </button>
                {index !== list.length - 1 && (
                  <div className="dropdown-divider"></div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(IndexTypes);
