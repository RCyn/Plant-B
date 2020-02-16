import React from 'react';
import styled from 'styled-components';

const StyledDisplay = styled.div`
  .sunlight {
    color: #615708;
  }

  .humidity {
    color: #455D7D;
  }

`;

const StyledCircular = styled.div`
  display: flex;
  #progressInput {
    margin: 20px auto;
    width: 30%;
  }

  .sunlight {
    .circle-background,
    .circle-progress {
      fill: #FFF2AF;
    }

    .circle-background {
      stroke: #DDDA91;
    }

    .circle-progress {
      stroke: #F5C108;
    }

    .circle-text {
      fill: #615708;
    }
  }

  .humidity {
    .circle-background,
    .circle-progress {
      fill: #90C8DB;
    }

    .circle-background {
      stroke: #84ADBA;
    }

    .circle-progress {
      stroke: #3278E3;
    }

    .circle-text {
      fill: #455D7D;
    }
  }

  .circle-progress {
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .circle-text {
    font-family: 'Roboto', sans-serif;
    font-size: 3em;
    font-weight: 400;
  }
`;

class CircularProgressBar extends React.Component {
  state = {type: this.props.type};

  render() {
    // const percentage = this.props.message ? this.props.message : this.props.percentage;
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const dotRadius = 3;
    const radius = (this.props.sqSize - this.props.strokeWidth - 2 * dotRadius) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.percentage / 100;

    return (
      <StyledCircular>
        <svg 
            className={this.state.type}
            width={this.props.sqSize}
            height={this.props.sqSize}
            viewBox={viewBox}>
            <circle
              className="circle-background"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`} />
            <circle
              className="circle-progress"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`}
              // Start progress marker at 12 O'Clock
              transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset
              }} />
            <text
              className="circle-text"
              x="50%"
              y="50%"
              dy=".3em"
              textAnchor="middle">
              {`${this.props.percentage}%`}
            </text>
        </svg>
      </StyledCircular>
    );
  }
}

// CircularProgressBar.defaultProps = {
//   sqSize: 200,
//   percentage: 25,
//   strokeWidth: 10
// };

class CircularDisplay extends React.Component {
  state = {
    percentage: this.props.percentage,
    type: this.props.type
  };

  // handleChangeEvent = this.handleChangeEvent.bind(this);

  // handleChangeEvent(event) {
  //   this.setState({
  //     percentage: event.target.value
  //   });
  // }

  render() {
    return (
      <StyledDisplay className={this.props.type}>
        <CircularProgressBar
          type={this.props.type}
          strokeWidth="20"
          sqSize="275"
          percentage={this.props.percentage}
          // message={this.props.message}
          />
        <p>{this.props.text}</p>
      </StyledDisplay>
    );
  }
}

export default CircularDisplay;
