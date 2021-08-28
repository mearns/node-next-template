/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";

const pages = [
  ["/", "Home"],
  ["/about", "About"],
  ["/alphabet", "Alphabet"],
];

const Header = () => {
  return (
    <header
      css={css`
        background: var(--primary-light);
        border-bottom: 1px solid var(--primary);
        padding: var(--page-padding);
      `}
    >
      {pages.map(([href, title]) => {
        return (
          <Link key={href} href={href} passHref={true}>
            <HeaderLink>{title}</HeaderLink>
          </Link>
        );
      })}
    </header>
  );
};
export default Header;

const HeaderLink = styled.a`
  margin-right: 15px;
`;
