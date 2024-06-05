import { FC } from "react";

export const Spinner: FC = () => {
  return (
    <div
      className='spinner-border d-block mx-auto mt-5'
      style={{
        width: "4rem",
        height: "4rem",
        borderColor: "#029191 transparent #029191 #029191",
        borderWidth: ".4rem",
      }}
      role='status'
    ></div>
  );
};
