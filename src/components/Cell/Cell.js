import React, { Component } from 'react';

export default class Cell extends Component {
	

    cellStyle = {
        border: '1px solid black',
        backgroundColor: `${this.props.data.alive ? 'black' : '#87CEFA'}`,
        padding: '0.25em',
        color:'black',
    }

    render(){
        return <button style={this.cellStyle} onClick={this.props.onClick} className="cell"></button>
    }

}