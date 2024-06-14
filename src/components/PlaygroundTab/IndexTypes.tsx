import { INDICES_TYPES } from "helpers/constants.ts/indices";
import { combineClassNames } from "helpers/functions/commons";
import { Fragment, MouseEventHandler, memo } from "react";
import { T_Indices } from "store/indices/types";
// import styles from "./modelTab.module.css";

type Props = {
  selectedIndexTypeState: [
    keyof T_Indices | null,
    React.Dispatch<React.SetStateAction<keyof T_Indices | null>>
  ];
};

function IndexTypes({ selectedIndexTypeState }: Props) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    selectedIndexTypeState[1](e.currentTarget.name as keyof T_Indices);
  };

  return (
    <div className={combineClassNames(["dropdown"])}>
      <button
        className={`btn btn-light dropdown-toggle ${
          selectedIndexTypeState[0] && "text-uppercase"
        }`}
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {selectedIndexTypeState[0] ?? "Select Index Type to Monitor"}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {INDICES_TYPES.map((indexType, index, list) => {
          return (
            <Fragment key={indexType}>
              <button
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
  );
}

export default memo(IndexTypes);
