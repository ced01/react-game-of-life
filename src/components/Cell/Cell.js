import React, { Component } from 'react';

import './Cell.css';

export default class Cell extends Component {

    
    render(){
        //console.log(this.props.data);
        return <button style={{backgroundColor: `${this.props.data.alive ? '#428bca' : '#ccccff'}`}} onClick={this.props.onClick} className="cell">{/*this.props.data.pos.y*/}</button>
    }

}