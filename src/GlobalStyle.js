import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background-image: linear-gradient(to right, #56ab2f, #a8e063);
  }
`;

export default GlobalStyle;
