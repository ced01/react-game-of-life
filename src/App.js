import React, { Component } from 'react';
import './App.css';

import Cell from './components/Cell/Cell';


class App extends Component {

  timerID = null;
  nbSimulation = 0;

  gridwidth = 17;
  gridheight = 17;

  constructor(props) {
    super(props);
    this.state = {
    cells: this.initialiseCell([{x:4,y:3},{x:3,y:3},{x:2,y:3},{x:5,y:3},{x:5,y:2},{x:2,y:5}]),
    arrayOfRows : []
    };
  }

  componentDidMount() {
    this.display();
    this.timerID = setInterval(
      () => {
        this.analyseCell();
        this.setState({arrayOfRows : []});
        this.display();
      },
      10
    );

    /*if(this.nbSimulation === 15 ){
      clearInterval(this.timerID);
    }*/
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  fillCellsPos(){
    let ih = 0, iw = 0, arr =[];
    for(ih = 0; ih < this.gridheight; ih++ ) {
      for(iw = 0; iw < this.gridwidth; iw++ ) {
        arr.push({alive : false , pos : {x:iw , y:ih}, nbOfCellsAliveNearMe:0})
      }
    }
    return arr;
  }

  initialiseCell(indexes){
    let cs = this.fillCellsPos();
    let c = 0, ind = 0;

    indexes.forEach(i => {
      for(c = 0; c < cs.length; c++){
        if(i.x === cs[c].pos.x && i.y === cs[c].pos.y){
            cs[c].alive = true;
        }
      }
    });
    ind = 0;
    for(c = 0; c < cs.length; c++){
      for(ind = c-1 ;ind < c + 1; ind++){
        if(ind > 0 && (ind < this.gridwidth * this.gridheight)) {
          if(cs[c].alive  && ind !== c){
            cs[ind].nbOfCellsAliveNearMe++;
          }
        }
      }
      ind = 0;
      for(ind = c + this.gridwidth - 1 ;ind < c + this.gridwidth + 1; ind++){
          if(ind < this.gridwidth * this.gridheight){
            if(cs[c].alive){   
              cs[ind].nbOfCellsAliveNearMe++;
             // debugger;
            }
          }
      }
      ind = 0;
      for(ind = (c - this.gridwidth - 1);ind < (c - this.gridwidth + 1); ind++){
        if(ind > 0){
          if(cs[c].alive) {
            cs[ind].nbOfCellsAliveNearMe++;
          }
        }  
      }
    }
    
    return cs;
  }

  analyseCell(){
    let cs = this.state.cells;
    let c = 0, ind = 0;
    let arr = [];
      for(c = 0; c < cs.length; c++){
        if(!cs[c].alive){
          if(cs[c].nbOfCellsAliveNearMe === 2){
            cs[c].alive = true;
            for(ind = c-1 ;ind < c + 1; ind++){
              if(ind > 0 && ind !== c && ind < this.gridwidth * this.gridheight){
                cs[ind].nbOfCellsAliveNearMe = cs[ind].nbOfCellsAliveNearMe + 1;
              }
            }
            ind = 0;
            for(ind = c + this.gridwidth - 1 ;ind < c + this.gridwidth + 1; ind++){
              if(ind < this.gridwidth * this.gridheight){
                cs[ind].nbOfCellsAliveNearMe = cs[ind].nbOfCellsAliveNearMe + 1;
              }
            }
            ind = 0;
            for(ind = c - this.gridwidth -1 ;ind < c - this.gridwidth + 1; ind++){
              if(ind > 0){
                cs[ind].nbOfCellsAliveNearMe = cs[ind].nbOfCellsAliveNearMe + 1;
              }
            }
          }
        } else {
          if(cs[c].nbOfCellsAliveNearMe < 2 || cs[c].nbOfCellsAliveNearMe > 3 || cs[c].pos.x === this.gridwidth - 1 || cs[c].pos.y === this.gridheight - 1 || cs[c].pos.x === 0 || cs[c].pos.y === 0){
            cs[c].alive = false;
            for(ind = c-1 ;(ind < c + 1) && ind !== c; ind++){
              if(ind > 0 && ind < this.gridwidth * this.gridheight){
                if(cs[ind].nbOfCellsAliveNearMe > 0){
                  cs[ind].nbOfCellsAliveNearMe = cs[ind].nbOfCellsAliveNearMe - 1;
                }else{
                  cs[ind].nbOfCellsAliveNearMe = 0;
                }
              }
            }
            ind = 0;
            for(ind = c - this.gridwidth -1 ; ind < c - this.gridwidth + 1; ind++){
              if(ind > 0 && ind < this.gridwidth * this.gridheight){
                if(cs[ind].nbOfCellsAliveNearMe > 0){
                  cs[ind].nbOfCellsAliveNearMe = cs[ind].nbOfCellsAliveNearMe - 1;
                }else{
                  cs[ind].nbOfCellsAliveNearMe = 0;
                }
              }
            }
            ind = 0;
            for(ind = c - this.gridwidth -1 ;ind < c - this.gridwidth + 1; ind++){
              if(ind > 0 && ind < this.gridwidth * this.gridheight){
                if(cs[ind].nbOfCellsAliveNearMe > 0){
                  cs[ind].nbOfCellsAliveNearMe = cs[ind].nbOfCellsAliveNearMe - 1;
                }else{
                  cs[ind].nbOfCellsAliveNearMe = 0;
                }
              }
            }
          }
        }
       // console.log(cs[c]);
        arr.push(cs[c]);
      }
      this.setState({cells:arr});
      console.log("Simulation ==> "+ this.nbSimulation);
      this.nbSimulation++;
     
  }

  display(){

    let id = 0, arr = [], cell = null;
    //console.log(arrayOfRows);
    this.setState({arrayOfRows : this.state.cells.map(c => {
      cell = <Cell key={id} posx={ c.pos.x } posy={ c.pos.y } alive={c.alive}/>;
      id++;
      arr.push(cell);
      return arr;
    })});
  }

  render() {
    return (
      <div className="wrapper">
        {this.state.arrayOfRows.map(r => r)}
      </div>
  );
    
  }
}

export default App;
