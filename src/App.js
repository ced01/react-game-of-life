import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './App.css';

import Cell from './components/Cell/Cell';
import LWSS from './components/Vessel/LWSS/LWSS';
import Environement from './components/Environement/Environement';




class App extends Component {

  timerID = null;
  nbTotalOfSimulation = 2;
  nbSimulation = 0;
  stepForTimer = 5;
  golIsRunning = false;
  
  env = new Environement(70,40,false);

  middlewidth = this.env.getWidth()/2;
  middleheight = this.env.getHeight()/2;

  gridwidthMinusOne = this.env.getWidth() - 1;
  gridheightMinusOne = this.env.getHeight() - 1;

  cellClicked = null;

  setOfInitialState = [
                       [{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight}],
                       [{x:this.middlewidth-2,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight}],
                       [{x:this.middlewidth-2,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight},{x:this.middlewidth+2,y:this.middleheight}],
                       [{x:this.middlewidth + 3,y:this.middleheight},{x:this.middlewidth + 2,y:this.middleheight},{x:this.middlewidth + 1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight-1},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight}],
                       [{x:this.middlewidth-1,y:this.middleheight+1},{x:this.middlewidth,y:this.middleheight+1},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight-1},{x:this.middlewidth+2,y:this.middleheight-1}],
                       [{x:this.middlewidth,y:this.middleheight+1},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth,y:this.middleheight-1},{x:this.middlewidth+1,y:this.middleheight-1}]
                       
                      ];

  cells = this.initialiseCell(this.setOfInitialState[0]);

  constructor(props) {
    super(props);
    this.state = {
    btnState : {
      btnColor : "success",
      btnLabel : "RUN"
    },
    arrayOfRows : [],
    };

    this.addThreeAlignedCells = this.addThreeAlignedCells.bind(this);
  }

  componentDidMount() {
    this.display();
    //this.runGoL();
  }

  playOneGoL() {
      this.setState({arrayOfRows : []});
      this.analyseCell();
      this.display();
  }

  runGoL(){
    this.setState({btnState : {
      btnColor : "secondary",
      btnLabel : "STOP"
    }});
     
      this.golIsRunning = true;
      this.timerID = setInterval(
        () => {
        /*if( this.nbSimulation !== this.nbTotalOfSimulation ){*/

            this.playOneGoL();
        //}
       /* if(this.nbSimulation === this.nbTotalOfSimulation ){
          this.pauseGoL();
        }*/
        },
        this.stepForTimer
      ); 
    
  }

  pauseGoL(){
    this.setState({btnState : {
      btnColor : "success",
      btnLabel : "RUN"
    }});
    this.golIsRunning = false;
    clearInterval(this.timerID);
  }

  componentWillUnmount() {
    this.pauseGoL();
  }

  initialiseCell(indexes){
    let cs = this.env.getContent(),
        c = 0, 
        ind = 0, 
        cell = null, 
        posx = 0, 
        posy = 0, 
        nbOfCells = 0,
        cplusOne = 0, 
        cminusOne = 0,
        indexPosX = 0,
        indexPosY = 0;

    // Initialise grid cells with indexes 

    indexes.forEach(i => {
      //console.log(i);
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
     

    for(c = 0; c < cs.length; c++){
      cell = cs[c];
      nbOfCells = this.env.getWidth() * this.env.getHeight();
      cminusOne = c - 1;
      cplusOne = c + 1;
    
      for(ind = cminusOne ;ind <= cplusOne; ind++){
        if(ind > 0 && (ind < nbOfCells) && cs[ind].alive && ind !== c) {
          cs[c].nbOfCellsAliveNearMe++;
        }
        if(ind + this.env.getWidth() < nbOfCells && cs[ind + this.env.getWidth()].alive){
          cs[c].nbOfCellsAliveNearMe++;
        }
        if(ind - this.env.getWidth() > 0 && cs[ind - this.env.getWidth()].alive){
          cs[c].nbOfCellsAliveNearMe++;;
        } 
      }
    }
    return cs;
  }

  analyseCell(){

      this.setCellsAlive();
      this.notifyCells();
      this.nbSimulation++;
  }

  setCellsAlive(){
    let c = 0, 
        cells = this.cells,
        cell = null,
        posx = 0, 
        posy = 0,
        nbOfCellsAliveNearMe = 0,
        gwmo = this.gridwidthMinusOne,
        ghmo = this.gridheightMinusOne;

    for(c = 0; c < cells.length; c++){
      cell = cells[c];
      nbOfCellsAliveNearMe = cell.nbOfCellsAliveNearMe; 
      posx = cell.pos.x;
      posy = cell.pos.y;
  
      if(cell.alive){
        if((nbOfCellsAliveNearMe < 2 || nbOfCellsAliveNearMe > 3) /*&& (posx !== gwmo && posy !== ghmo && posx !== 0 && posy !== 0)*/){
          cell.alive = false;
        }
      } else {
        if(nbOfCellsAliveNearMe === 3 /*|| posx === gwmo || posy === ghmo || posx === 0 || posy === 0*/){
          cell.alive = true;
        }
      }
    }
  }
  notifyCells(){

    let c = 0, 
        ind = 0,
        cells = this.cells,
        cell = null,
        nbOfCells = this.env.getWidth() * this.env.getHeight(), 
        cplusOne = 0, 
        cminusOne = 0,
        subindexplus = 0,
        subindexminus = 0;

    for(c = 0; c < this.cells.length; c++){

      cell = cells[c];
      cminusOne = c - 1;
      cplusOne = c + 1;
      cell.nbOfCellsAliveNearMe = 0;

      for(ind = cminusOne ;ind <= cplusOne; ind++){

        subindexplus = ind + this.env.getWidth();
        subindexminus = ind - this.env.getWidth();

        if(ind > 0 && ind < nbOfCells && cells[ind].alive && ind !== c) {
          cell.nbOfCellsAliveNearMe++;
        }
        if(subindexplus < nbOfCells && cells[subindexplus].alive){
          cell.nbOfCellsAliveNearMe++; 
        }
        if(subindexminus > 0 && cells[subindexminus].alive){
          cell.nbOfCellsAliveNearMe++;
        } 
      }
    }
  }

  display(){
    
   let cells = this.cells, id = 0; /*cell = null,arr = [],posx = 0, posy = 0, alive = false;*/

    let arr = cells.map( c => {
      let btn = <Cell key={id} 
                      data={ c } 
                      onClick={this.addThreeAlignedCells.bind(this,id)}
                />
      id++;
      return btn
      }
    );
    this.setState({arrayOfRows : arr});
  }

  addThreeAlignedCells(centerIndex){
    let vessel = new LWSS(this.cells,centerIndex,0,this.env.getWidth());
    vessel.setOrigin(centerIndex);
    vessel.create();
    this.notifyCells();
    this.display();
  }

  render() {
    return (
      <div>
        <div className="menu">
          <div className="simulation-number"> Simulation N° { this.nbSimulation }</div>
          <Button className="btn" outline color={this.state.btnState.btnColor} onClick={() => {this.golIsRunning ?  this.pauseGoL() : this.runGoL()}}>{ this.state.btnState.btnLabel }</Button>
        </div>
        <div className="wrapper">
          {this.state.arrayOfRows.map(r => r)}
        </div>
      </div>
  );
    
  }
}

export default App;
