/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Loading = ({ children = "Loading..." }) => {
  return (
    <div
      css={css`
        padding: 23px 31px;
      `}
    >
      {children}
    </div>
  );
};
export default Loading;
