import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

    @font-face {
    font-family: 'Happiness-Sans-Bold';
    src: url('./assets/fonts/Happiness-Sans-Bold.ttf') format('truetype');
}

    body {
    font-family: 'Happiness-Sans-Bold', sans-serif;
}

`;

export default GlobalStyles;
