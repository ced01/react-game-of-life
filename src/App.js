import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import './App.css';

import Cell from './components/Cell/Cell';
import LWSS from './components/Vessel/LWSS/LWSS';
import Environement from './components/Environement/Environement';




class App extends Component {

  timerID = null;
  nbTotalOfSimulation = 2;
  nbSimulation = 0;
  stepForTimer = 10;
  golIsRunning = false;
  
  env = new Environement(54,54,false);

  middlewidth = this.env.getWidth()/2 - 1;
  middleheight = this.env.getHeight()/2 - 1;

  gridwidthMinusOne = this.env.getWidth() - 1;
  gridheightMinusOne = this.env.getHeight() - 1;

  cellClicked = null;

  setOfFrame = [
                [{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight}],
                [{x:this.middlewidth-2,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight}],
                [{x:this.middlewidth-2,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight},{x:this.middlewidth+2,y:this.middleheight}],
                [{x:this.middlewidth + 3,y:this.middleheight},{x:this.middlewidth + 2,y:this.middleheight},{x:this.middlewidth + 1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight-1},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth-1,y:this.middleheight}],
                [{x:this.middlewidth-1,y:this.middleheight+1},{x:this.middlewidth,y:this.middleheight+1},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight},{x:this.middlewidth+1,y:this.middleheight-1},{x:this.middlewidth+2,y:this.middleheight-1}],
                [{x:this.middlewidth,y:this.middleheight+1},{x:this.middlewidth-1,y:this.middleheight},{x:this.middlewidth,y:this.middleheight},{x:this.middlewidth,y:this.middleheight-1},{x:this.middlewidth+1,y:this.middleheight-1}]
                
              ];

  cells = this.generateAliveCellsAt(this.setOfFrame[2],false);

  constructor(props) {
    super(props);
    this.state = {
    selectedForm : 0,
    btnState : {
      btnColor : "success",
      btnLabel : "RUN"
    },
    arrayOfRows : [],
    };

    this.generateFrameOnClick = this.generateFrameOnClick.bind(this);
    this.wipeOut = this.wipeOut.bind(this);
    this.generateRandFrame = this.generateRandFrame.bind(this);
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

  generateAliveCellsAt(indexes, fromRand){
    let cs = fromRand ? this.cells: this.env.getContent(),
        c = 0, 
        cell = null, 
        posx = 0, 
        posy = 0, 
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
          console.log(posx + " " +posy); 
          cell.alive  = true;
        }
      }
    });
     
    this.notifyCells(cs);

    return cs;
  }

  analyseCell(){

      this.setCellsAlive();
      this.notifyCells([]);
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
        if(nbOfCellsAliveNearMe === 3 /*|| (posx === gwmo || posy === ghmo || posx === 0 || posy === 0)*/){
          cell.alive = true;
        }
      }
    }
  }
  notifyCells(cs){

    let c = 0, 
        ind = 0,
        cells = cs.length !== 0 ? cs : this.cells,
        cell = null,
        cellPos = null,
        nbOfCells = this.env.getWidth() * this.env.getHeight(), 
        cplusOne = 0, 
        cminusOne = 0,
        subindexplus = 0,
        subindexminus = 0,
        indexBorder =  this.env.getHeight()*(this.env.getWidth()),
        bordersubindexminus = 0,
        bordersubindexplus = 0;

  
    for(c = 0; c < cells.length; c++){

      cell = cells[c];
      cellPos = cell.pos;
      cminusOne = c - 1;
      cplusOne = c + 1;
      cell.nbOfCellsAliveNearMe = 0;

      /*if(cellPos.x === 0){
        for(ind = c ;ind <= cplusOne; ind++){
          subindexplus = ind + this.env.getWidth();
          subindexminus = ind - this.env.getWidth();

          if(cells[ind].alive && ind !== c){
            cell.nbOfCellsAliveNearMe++;
          }
          if(subindexplus < nbOfCells && cells[subindexplus].alive){
            cell.nbOfCellsAliveNearMe++; 
          }
          if(subindexminus > 0 && cells[subindexminus].alive){
            cell.nbOfCellsAliveNearMe++;
          }
        }
        for(ind = c + this.env.getWidth() - 1; ind < c + this.env.getWidth() + 1; ind++){
          if(ind < nbOfCells && cells[ind].alive) {
            cell.nbOfCellsAliveNearMe++;
          }
        }
      }else{*/
        for(ind = cminusOne ;ind <= cplusOne; ind++){

          subindexplus = ind + this.env.getWidth();
          subindexminus = ind - this.env.getWidth();
          bordersubindexminus = subindexminus + indexBorder;
          bordersubindexplus = subindexplus - indexBorder;
  
          if(ind > 0 && ind < nbOfCells && cells[ind].alive && ind !== c) {
            cell.nbOfCellsAliveNearMe++;
          }
          if(ind > nbOfCells && cells[this.env.getHeight()*(this.env.getWidth()-1) - ind].alive && ind !== c) {
            cell.nbOfCellsAliveNearMe++;
          }
          if(ind < 0 && cells[ind + this.env.getHeight()*(this.env.getWidth()-1)].alive && ind !== c) {
            cell.nbOfCellsAliveNearMe++;
          }
          if(subindexplus < nbOfCells && cells[subindexplus].alive){
            cell.nbOfCellsAliveNearMe++; 
          }
          if(subindexminus > 0 && cells[subindexminus].alive){
            cell.nbOfCellsAliveNearMe++;
          }
          if(subindexplus > nbOfCells && cells[bordersubindexplus].alive) {
            cell.nbOfCellsAliveNearMe++;
          }
          if(subindexminus < 0 && cells[bordersubindexminus].alive) {
            cell.nbOfCellsAliveNearMe++;
          }
        }
      }
    //}
  }

  display(){
    
   let cells = this.cells, id = 0; /*cell = null,arr = [],posx = 0, posy = 0, alive = false;*/

    let arr = cells.map( c => {
      let btn = <Cell key={id} 
                      data={ c } 
                      onClick={this.generateFrameOnClick.bind(this,id)}
                />
      id++;
      return btn
      }
    );
    this.setState({arrayOfRows : arr});
  }

  wipeOut(){
    this.cells = this.env.initialise();
    this.display();
  }

  generateFrameOnClick(index){
    console.log(index);
    /*let vessel = new LWSS(this.cells,centerIndex,0,this.env.getWidth());
    vessel.setOrigin(index);
    vessel.create();*/
    this.generateAliveCellsAt(this.env.generateFrameAtPos(index)[this.state.selectedForm], true);
    this.notifyCells([]);
    this.display();
  }

  generateRandFrame(){
    this.generateAliveCellsAt(this.env.generateFrameAtPos(null)[Math.floor(Math.random() * (this.setOfFrame.length - 1))], true);
    this.notifyCells([]);
    this.display();
  }

  swapForm(e){
    this.setState({selectedForm: e.target.value});
  }

  render() {
    return (
      <div>
        <Row className="menu">
          <Col xs="12" sm="2"><div className="simulation-number"> S. N° { this.nbSimulation }</div></Col>
          <Col xs="12" sm="2"><Button className="btn" outline color={this.state.btnState.btnColor} onClick={() => {this.golIsRunning ?  this.pauseGoL() : this.runGoL()}}>{ this.state.btnState.btnLabel }</Button></Col>
          <Col xs="12" sm="2"><Button className="btn" outline color="danger" onClick={() => {this.wipeOut()}}>CLEAR</Button></Col>
          <Col xs="12" sm="2"><Button className="btn" outline color="info" onClick={() => {this.generateRandFrame()}}>RAMDOM</Button></Col>
          <Col xs="12" sm="2">
            <Form> 
              <FormGroup> 
                <Input type="select" name="select" id="exampleSelect" onChange={(e) => {this.swapForm(e)}}> 
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Input>
              </FormGroup>
          </Form> 
          </Col>
        </Row>
        <div className="wrapper">
          {this.state.arrayOfRows.map(r => r)}
        </div>
    </div>
  );
    
  }
}

export default App;
