/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Index = () => {
  return (
    <p>
      Hello{" "}
      <span
        css={css`
          background-color: var(--dark);
          color: var(--light);
        `}
      >
        NextJS
      </span>
    </p>
  );
};
export default Index;
