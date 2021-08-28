/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "../components/Header";
import "../resources/styles/main.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main
        css={css`
          padding: 0 var(--page-padding);
        `}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}
