import React, { Component } from 'react';

import './Cell.css';

export default class Cell extends Component {

    
    render(){
        return <button style={{backgroundColor: `${this.props.data.alive ? '#428bca' : '#ccccff'}`}} onClick={this.props.onClick} className="cell"></button>
    }

}