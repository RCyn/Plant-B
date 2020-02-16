import React from 'react';
import styled from 'styled-components';

import CircularDisplay from './circular_display';

const StyledTab = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
`;

const StyledTabList = styled.div`
  text-align: center;
  padding-bottom: 20px;
`;

const StyledTabPanels = styled.div`
  padding: 10px;
`;

const StyledTabPanel = styled.div`
  display: flex;
  grid-template-columns: 50% 50%;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  text-align: center;
  margin: 50px;

  @media(max-width: 700px) {
    flex-direction: column;
  }
`;

const tab = {
  fontSize: '2rem',
  color: '#2D5A4B',
  display: 'inline-block',
  padding: 10,
  margin: 10,
  cursor: 'pointer'};

const styles = {
  tab,
  activeTab: {
    ...tab,
    borderBottom: '4px solid',
    borderBottomColor: '#2D5A4B' },
  disabledTab: {
    ...tab,
    opacity: 0.25,
    cursor: 'default' },
};

const TabList = props => {
    const children = React.Children.map(props.children, (child, index) => {
      return React.cloneElement(child, {
        isActive: index === props.activeIndex,
        onClick: () => props.onActivate(index)
      })
    })

    return <StyledTabList>{children}</StyledTabList>
  };

const Tab = props => 
      <div
        onClick={props.disabled ? null : props.onClick}
        style={props.disabled ? styles.disabledTab : (
          props.isActive ? styles.activeTab : styles.tab
        )}
      >
        {props.children}
      </div>;

const TabPanels = props => 
      <StyledTabPanels>
        {props.children[props.activeIndex]}
      </StyledTabPanels>;

const TabPanel = (props) => <StyledTabPanel>{props.children}</StyledTabPanel>;

class Tabs extends React.Component {
  state = {
    activeIndex: 0
  }

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      if (child.type === TabPanels) {
        return React.cloneElement(child, {
          activeIndex: this.state.activeIndex
        })
      } else if (child.type === TabList) {
        return React.cloneElement(child, {
          activeIndex: this.state.activeIndex,
          onActivate: (activeIndex) => this.setState({ activeIndex })
        })
      } else {
        return child
      }
    })

    return <StyledTab>{children}</StyledTab>
  }
}

class PlantTabs extends React.Component {
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>Cactus</Tab>
          <Tab>Tulip</Tab>
          <Tab>Tomato</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CircularDisplay type="sunlight" percentage={34} text="Sunlight"/>
            <CircularDisplay type="humidity" percentage={30} text="Humidity"/>
          </TabPanel>
          <TabPanel>
            <CircularDisplay type="sunlight" percentage={42} text="Sunlight"/>
            <CircularDisplay type="humidity" percentage={55} text="Humidity"/>
          </TabPanel>
          <TabPanel>
            <CircularDisplay type="sunlight" percentage={61} text="Sunlight"/>
            <CircularDisplay type="humidity" percentage={42} text="Humidity"/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  }
}

export default PlantTabs;

