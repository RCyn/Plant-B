import React from 'react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

import Header from './header';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightGrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

// global styles
injectGlobal`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  
  html {
    box-sizing: border-box;
    font-size: 100%;
    height: 100%;
    background: rgba(172,239,61,0.2);
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    font-size: 1rem;
    line-height: 2;
    padding: 0;
    margin: 0;
    height: 100%;
  }

  p {
    font-size: 2rem;
  }

  a {
    text-decoration: none;
    color: ${theme.black};
  }

  @media (max-width: 700px) {
    width: 100%;
    justify-content: center;
    font-size: 1.5rem;
  }
`;

// page styles
const StyledPage = styled.div`
  color: ${props => props.theme.black};
`;

// inner container styles
const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Page extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Header />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
