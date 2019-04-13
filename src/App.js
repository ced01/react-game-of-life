import React, { Component } from 'react';
import './App.css';

import Cell from './components/Cell/Cell';


class App extends Component {

  timerID = null;
  nbSimulation = 0;

  gridwidth = 17;
  gridheight = 17;

  gridwidthMinusOne = this.gridwidth - 1;
  gridheightMinusOne = this.gridheight - 1;

  cells = [];

  constructor(props) {
    super(props);
    this.state = {
    cells: this.initialiseCell([{x:4,y:1},{x:3,y:1},{x:2,y:1}]),
    arrayOfRows : []
    };
  }

  componentDidMount() {
    this.display();
    
    this.timerID = setInterval(
      () => {
        if(this.nbSimulation !== 3){
          this.setState({arrayOfRows : []});
          this.analyseCell();
          this.display();
        }
        if(this.nbSimulation === 15 ){
          clearInterval(this.timerID);
        }
      },
      1000
    );
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
    let cs = this.fillCellsPos(),
        c = 0, 
        ind = 0, 
        cell = null, 
        posx = 0, 
        posy = 0,
        cplusgridwMinusOne = 0, 
        cplusgridwPlusOne = 0, 
        cminusgridwMinusOne = 0, 
        nbOfCells = 0, 
        cminusgridwPlusOne = 0,
        cplusOne =0, 
        cminusOne = 0,
        indexPosX = 0,
        indexPosY = 0;

    // Initialise grid cells with indexes 

    indexes.forEach(i => {
      indexPosX = i.x;
      indexPosY = i.y;
      
      for(c = 0; c < cs.length; c++){
        cell = cs[c];
        posx = cell.pos.x;
        posy = cell.pos.y;
        
        if(indexPosX === posx && indexPosY === posy){
          cell.alive  = true;
        }
      }
    });

    // Initialise grid cells with indexes 

    for(c = 0; c < cs.length; c++){
      cell = cs[c];
      cplusgridwMinusOne = c + this.gridwidth - 1;
      cplusgridwPlusOne = c + this.gridwidth + 1;
      cminusgridwMinusOne = c - this.gridwidth - 1;
      cminusgridwPlusOne = c - this.gridwidth + 1;
      nbOfCells = this.gridwidth * this.gridheight;
      cminusOne = c - 1;
      cplusOne = c + 1;
      //debugger;
      for(ind = cminusOne ;ind <= cplusOne; ind++){
        if(ind > 0 && (ind < nbOfCells) && cs[ind].alive && ind !== c) {
            cs[c].nbOfCellsAliveNearMe = cs[c].nbOfCellsAliveNearMe + 1;
           // console.log(cs[c]);
        }
      }
      for(ind = cplusgridwMinusOne ;ind <= cplusgridwPlusOne; ind++){
          if(ind < nbOfCells && cs[ind].alive){
              cs[c].nbOfCellsAliveNearMe = cs[c].nbOfCellsAliveNearMe + 1;
          }
      }
      for(ind = cminusgridwMinusOne;ind <= cminusgridwPlusOne; ind++){
        if(ind > 0 && cs[ind].alive){
          cs[c].nbOfCellsAliveNearMe = cs[c].nbOfCellsAliveNearMe + 1;
        } 
      }
    }
    return cs;
  }

  analyseCell(){
    let c = 0, 
        ind = 0,
        arr = [],
        cell = null,
        posx = 0, 
        posy = 0,
        cplusgridwMinusOne = 0, 
        cplusgridwPlusOne = 0, 
        cminusgridwMinusOne = 0, 
        nbOfCells = 0, 
        cplusOne =0, 
        cminusOne = 0,
        cminusgridwPlusOne = 0;

        this.cells = this.state.cells;

        for(c = 0; c < this.cells.length; c++){
          cell = this.cells[c];
          posx = cell.pos.x;
          posy = cell.pos.y;
          cplusgridwMinusOne = c + this.gridwidth - 1;
          cplusgridwPlusOne = c + this.gridwidth + 1;
          cminusgridwMinusOne = c - this.gridwidth - 1;
          cminusgridwPlusOne = c - this.gridwidth + 1;
          nbOfCells = this.gridwidth * this.gridheight;
          cminusOne = c - 1;
          cplusOne = c + 1;
        
          if(this.cells[c].alive){
            if(this.cells[c].nbOfCellsAliveNearMe < 2 || this.cells[c].nbOfCellsAliveNearMe > 3 /*|| posx === this.gridwidthMinusOne || posy === this.gridwidthMinusOne || posx === 0 || posy === 0*/){
              this.cells[c].alive = false;
            }
          } else {
            if(this.cells[c].nbOfCellsAliveNearMe === 3){
              this.cells[c].alive = true;
            }
          }
        }
        for(c = 0; c < this.cells.length; c++){
          cell = this.cells[c];
          posx = cell.pos.x;
          posy = cell.pos.y;
          cplusgridwMinusOne = c + this.gridwidth - 1;
          cplusgridwPlusOne = c + this.gridwidth + 1;
          cminusgridwMinusOne = c - this.gridwidth - 1;
          cminusgridwPlusOne = c - this.gridwidth + 1;
          nbOfCells = this.gridwidth * this.gridheight;
          cminusOne = c - 1;
          cplusOne = c + 1;

          this.cells[c].nbOfCellsAliveNearMe = 0;

          for(ind = cminusOne ;ind <= cplusOne; ind++){
            if(ind > 0 && (ind < nbOfCells) && this.cells[ind].alive && ind !== c) {
              this.cells[c].nbOfCellsAliveNearMe = this.cells[c].nbOfCellsAliveNearMe + 1;
              console.log(this.cells[c]);
            }
          }
          for(ind = cplusgridwMinusOne ;ind <= cplusgridwPlusOne; ind++){
              if(ind < nbOfCells && this.cells[ind].alive){
                this.cells[c].nbOfCellsAliveNearMe = this.cells[c].nbOfCellsAliveNearMe + 1;
              }
          }
          for(ind = cminusgridwMinusOne;ind <= cminusgridwPlusOne; ind++){
            if(ind > 0 && this.cells[ind].alive){
              this.cells[c].nbOfCellsAliveNearMe = this.cells[c].nbOfCellsAliveNearMe + 1;
            } 
          }
        }

      this.setState({cells:this.cells});
      console.log("Simulation ==> "+ this.nbSimulation);
      this.nbSimulation++;
  }

  display(){

    let id = 0, arr = [], cell = null;
    //console.log(arrayOfRows);
    this.setState({arrayOfRows : this.state.cells.map(c => {
        arr=[];
        cell = <Cell key={id} posx={ c.pos.x } posy={ c.pos.y } alive={c.alive}/>;
        id++;
        arr.push(cell);
        return arr;
      })
    });
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
