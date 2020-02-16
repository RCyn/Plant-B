import React from 'react';
import styled from 'styled-components';

import logo from '../Logo.png';
import Switch from './switch';
import Profile from '../Profile.jpg';

// page styles
const StyledHeader = styled.div`
  display: flex;
  grid-template-columns: auto 1fr auto;
  justify-content: space-between;
  align-items: stretch;
  line-height: 2;
  padding: 20px;

  .logo {
    width: 125px;
  }

  .switch {
    align-items: center;
  }

  .profile {
    border-radius: 50%;
    width: 50px;
  }

  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    .logo {
      width: 100px;
      margin-right: 25%;
    }

    .profile {
      margin-left: 50%;
    }
  }
`;

class Header extends React.Component {
  render() {
    return (
      <StyledHeader>
        <img className="logo" src={logo} alt="Plant B"/>
        <Switch className="switch" />
        <img className="profile" src={Profile} alt="Profile"/>
      </StyledHeader>
    )
  }
}

export default Header;