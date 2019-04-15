import React, { Component } from 'react';
import './App.css';

import Cell from './components/Cell/Cell';


class App extends Component {

  timerID = null;
  nbTotalOfSimulation = 2;
  nbSimulation = 0;

  gridwidth = 70;
  gridheight = 40;

  middlewidth = this.gridwidth/2;
  middleheight = this.gridheight/2;

  gridwidthMinusOne = this.gridwidth - 1;
  gridheightMinusOne = this.gridheight - 1;

  cellClicked = null;

  setOfInitialState = [
                       [{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight}],
                       [{x:this.middlewidth-2,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight}],
                       [{x:this.middlewidth-2,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight},{x:this.middlewidth+2,y:this.middleheight}],
                       [{x:this.middlewidth + 3,y:this.middleheight},{x:this.middlewidth + 2,y:this.middleheight},{x:this.middlewidth + 1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight-1},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight}],
                       [{x:this.middlewidth-1,y:this.middleheight+1},{x:this.middlewidth,y:this.middleheight+1},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight-1},{x:this.middlewidth+2,y:this.middleheight-1}],
                       [{x:this.middlewidth,y:this.middleheight+1},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth,y:this.middleheight-1},{x:this.middlewidth+1,y:this.middleheight-1}]
                       
                      ];

  cells = this.initialiseCell([0]);

  constructor(props) {
    super(props);
    this.state = {
    arrayOfRows : []
    };
    this.addThreeAlignedCells = this.addThreeAlignedCells.bind(this);
  }

  componentDidMount() {
    
    this.display();
    this.timerID = setInterval(
      () => {
      /*if( this.nbSimulation !== this.nbTotalOfSimulation ){*/
          this.setState({arrayOfRows : []});
          this.analyseCell();
      /*}
      if(this.nbSimulation === this.nbTotalOfSimulation ){*/
        /*clearInterval(this.timerID);*/
      //}
      },
      10
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
        nbOfCells = 0, 
        cplusOne = 0, 
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

    for(c = 0; c < cs.length; c++){
      cell = cs[c];
      nbOfCells = this.gridwidth * this.gridheight;
      cminusOne = c - 1;
      cplusOne = c + 1;
    
      for(ind = cminusOne ;ind <= cplusOne; ind++){
        if(ind > 0 && (ind < nbOfCells) && cs[ind].alive && ind !== c) {
            cs[c].nbOfCellsAliveNearMe++;
        }
        if(ind + this.gridwidth < nbOfCells && cs[ind + this.gridwidth].alive){
          cs[c].nbOfCellsAliveNearMe++;
        }
        if(ind - this.gridwidth > 0 && cs[ind - this.gridwidth].alive){
          cs[c].nbOfCellsAliveNearMe++;;
        } 
      }
    }
    return cs;
  }

  analyseCell(){

      this.setCellsAlive();
      this.notifyCells();
      this.display();
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
        ghmo = this.gridheightMinusOne,
        ind  = 0,
        nbOfCells = this.gridwidth * this.gridheight,
        cellClicked = this.cellClicked;

    for(c = 0; c < cells.length; c++){
      cell = cells[c];
      nbOfCellsAliveNearMe = cell.nbOfCellsAliveNearMe; 
      posx = cell.pos.x;
      posy = cell.pos.y;
      ind = 0;


      if(cell.alive){
        if((nbOfCellsAliveNearMe < 2 || nbOfCellsAliveNearMe > 3) /*&& (posx !== gwmo && posy !== ghmo && posx !== 0 && posy !== 0)*/){
          cell.alive = false;
        }
      } else {
        if(nbOfCellsAliveNearMe === 3 /*|| posx === gwmo || posy === ghmo || posx === 0 || posy === 0*/){
          cell.alive = true;
        }
        if(cellClicked !== null){
          if(c-1 > 0 && c+1 < nbOfCells){
            if(cellClicked){

              for(ind = cellClicked-1; ind <= cellClicked+1 ; ind++) {
                cells[ind].alive = true;
                if(ind === cellClicked + 1){
                  if(ind + this.gridwidth < nbOfCells && !cells[ind + this.gridwidth].alive){
                    cells[ind + this.gridwidth].alive = true;
                  }
                }
                if(ind === cellClicked){
                  if(ind + 2*this.gridwidth < nbOfCells && !cells[ind + 2*this.gridwidth].alive){
                    cells[ind + 2*this.gridwidth].alive = true;
                  }
                }
              } 
            }
          }
          this.cellClicked = null;
        }
      }
      //console.log(c);
    }
  }
  notifyCells(){

    let c = 0, 
        ind = 0,
        cells = this.cells,
        cell = null,
        nbOfCells = this.gridwidth * this.gridheight, 
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

        subindexplus = ind + this.gridwidth;
        subindexminus = ind - this.gridwidth;

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
      let btn = <Cell key={id} posx={ c.pos.x } posy={ c.pos.y } alive={c.alive} onClick={this.addThreeAlignedCells.bind(this,id)}/>
      id++;
      return btn
      }
    );
    this.setState({arrayOfRows : arr});
  }

  addThreeAlignedCells(centerIndex){
    this.cellClicked = centerIndex;
  }

  render() {
    return (
      <div>
        <div className="simulation-number"> Simulation N° { this.nbSimulation }</div>
        <div className="wrapper">
          {this.state.arrayOfRows.map(r => r)}
        </div>
      </div>
  );
    
  }
}

export default App;
