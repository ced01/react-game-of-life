import React, { Component } from 'react';

export default class Cell extends Component {
	
	setAlive(alive) {
		this.alive = alive;
    }

    setPos(x,y) {
        this.props.posx = x;
        this.props.posy = y;
    }

    cellStyle = {
        border: '1px solid black',
        backgroundColor: `${this.props.alive ? 'black' : '#87CEFA'}`,
        padding: '0.25em',
        color:'black',
    }

    render(){
        return <div style={this.cellStyle} className="cell">  </div>
    }

}