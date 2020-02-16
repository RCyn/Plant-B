import React from 'react';
import away from '../away.png';
import home from '../home.png';

const imagesPath = {
  monitor: home,
  maintenance: away
}

class Switch extends React.Component {
  state = {
    monitor: true
  }
  toggleImage = () => {
    this.setState(state => ({ monitor: !state.monitor }))
  }

  getImageName = () => this.state.monitor ? 'monitor' : 'maintenance'

  render() {
    const imageName = this.getImageName();
    return (
      <img style={{maxWidth: '100px'}} src={imagesPath[imageName]} onClick={this.toggleImage} alt="switch between home and away status"/>
    );
  }
}

export default Switch;