import React, { Component } from 'react';

import Cell from '../Cell/Cell';

import './Univers.css';

export default class Univers extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            arrayOfRows : []
        }
    }

    componentDidMount() {
        this.fill()
    }
    

    fill() {
        const arrayOfRows = [];
        let indexw = 0, indexh = 0;
        let row = [], alive = false;
        let id = 0;

        for(indexh = 0; indexh < 35; indexh++ ) {
            row = [];
            for(indexw = 0; indexw < 50; indexw++ ) {
                alive = false;
                this.props.cells.forEach(element => {
                        if(element.x === indexw && element.y === indexh){
                            alive = true;
                        }
                    });
                row.push(<Cell key={id} posx={ indexw } posy={ indexh } alive={alive}/>)
                id++;
            }
            arrayOfRows.push(<div className="rowstyle" key={indexh}>{row}</div>);
        }
        this.setState({arrayOfRows : arrayOfRows});
    }


    render(){
        let univerStyle = {
            height: '600px',
        }
        const rows = this.state.arrayOfRows.map(r => r);
        
        return (
            <div style={univerStyle}>{rows}</div>
        )
    }

	
}