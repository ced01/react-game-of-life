import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import './App.css';

import Cell from './components/Cell/Cell';
import LWSS from './components/Vessel/LWSS/LWSS';
import Environement from './components/Environement/Environement';




class App extends Component {

  timerID = null;
  nbTotalOfSimulation = 3;
  nbSimulation = 0;
  stepForTimer = 10;
  golIsRunning = false;
  
  env = window.innerWidth <= 737 ? new Environement(40,40,false) : new Environement(54,54,false);

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
       // if( this.nbSimulation !== this.nbTotalOfSimulation ){
          this.playOneGoL();
        //}
       /*if(this.nbSimulation === this.nbTotalOfSimulation ){
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
    let cs = fromRand ? this.cells: this.env.getContent(), c = 0;

    indexes.forEach(i => {
      for(c = 0; c < cs.length; c++){
        if(i.x === cs[c].pos.x && i.y === cs[c].pos.y){
          cs[c].alive  = true;
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

  findCellAccordingToPos(cells, x, y ){
    for(let c = 0; c < cells.length; c++){
      if(cells[c].pos.x === x && cells[c].pos.y === y){
        return cells[c];
      }
    }
  }

  setCellsAlive(){
    let c = 0, 
        cells = this.cells,
        cell = null,
        posx = 0, 
        posy = 0,
        gwmo = this.gridwidthMinusOne,
        ghmo = this.gridheightMinusOne;

    for(c = 0; c < cells.length; c++){
      cell = cells[c]; 
      posx = cell.pos.x;
      posy = cell.pos.y;
  
      if(cell.alive){
        if((cell.nbOfCellsAliveNearMe < 2 || cell.nbOfCellsAliveNearMe > 3) /*&& (posx !== gwmo && posy !== ghmo && posx !== 0 && posy !== 0)*/){
          cell.alive = false;
        }
      } else {
        if(cell.nbOfCellsAliveNearMe === 3 /*|| (posx === gwmo || posy === ghmo || posx === 0 || posy === 0)*/){
          cell.alive = true;
        }
      }
    }
  }
  notifyCells(cs){

    let c = 0, 
        i = 0,
        cells = cs.length !== 0 ? cs : this.cells,
        cell = null,
        cellPos = null,
        nbOfCells = this.env.getWidth() * this.env.getHeight(), 
        w = this.env.getWidth(),
        h = this.env.getHeight(),
        cplusOne = 0, 
        cminusOne = 0,
        subindexplus = 0,
        subindexminus = 0,
        bordersubindexminus = 0,
        bordersubindexplus = 0;

    let initialCell = cells[0], 
        rightTopCell = this.findCellAccordingToPos(cells, w-1, 0 ), 
        leftBottomCell = this.findCellAccordingToPos(cells, 0, h-1 ),
        righBottomCell = this.findCellAccordingToPos(cells, w-1, h-1 );  

    // initialCell
    /*let xEqualToOneYEqualToZero = this.findCellAccordingToPos(cells, 1, 0 );
    let xEqualToOneYEqualToOne = this.findCellAccordingToPos(cells, 1, 1);
    let xEqualToZeroYEqualToOne = this.findCellAccordingToPos(cells, 0, 1);
    let xEqualToWminusOneYEqualToZero = this.findCellAccordingToPos(cells, w - 1, 0 );
    let xEqualToWminusOneYEqualToOne = this.findCellAccordingToPos(cells, w - 1,  1);
    let xEqualToWminusOneYEqualToHMinusOne = this.findCellAccordingToPos(cells, w - 1, h - 1);
    let xEqualToZeroYEqualToHMinusOne = this.findCellAccordingToPos(cells, 0 , h - 1);
    let xPlusOneYEqualToHMinusOne = this.findCellAccordingToPos(cells, 1 , h - 1);
      
    if( initialCell.alive ){
      xEqualToWminusOneYEqualToZero.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToOne.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xEqualToZeroYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xPlusOneYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xEqualToOneYEqualToZero.nbOfCellsAliveNearMe++;
      xEqualToOneYEqualToOne.nbOfCellsAliveNearMe++;
      xEqualToZeroYEqualToOne.nbOfCellsAliveNearMe++;
    }

    //rightTopCell
    let xEqualToWminusTwoYEqualToZero = this.findCellAccordingToPos(cells, w-2, 0 );
    let xEqualToWminusTwoYEqualToOne = this.findCellAccordingToPos(cells, w-2, 1);
    let xEqualToWminusTwoYEqualToHMinusOne = this.findCellAccordingToPos(cells, w - 2, h - 1);

    if( rightTopCell.alive ){
      
      xEqualToZeroYEqualToOne.nbOfCellsAliveNearMe++;
      initialCell.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xEqualToZeroYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xEqualToWminusTwoYEqualToZero.nbOfCellsAliveNearMe++;
      xEqualToWminusTwoYEqualToOne.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToOne.nbOfCellsAliveNearMe++;
      xEqualToWminusTwoYEqualToHMinusOne.nbOfCellsAliveNearMe++;
    }

    //leftBottomCell
    let xEqualToZeroYEqualToHMinusTwo = this.findCellAccordingToPos(cells, 0, h-2);
    let xEqualToOneYEqualToHMinusTwo = this.findCellAccordingToPos(cells, 1, h-2);
    let xEqualToWMinusOneYEqualToHMinusTwo = this.findCellAccordingToPos(cells, w-1, h-2);

    if(leftBottomCell.alive){

      xPlusOneYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xEqualToZeroYEqualToHMinusTwo.nbOfCellsAliveNearMe++;
      xEqualToOneYEqualToHMinusTwo.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToHMinusOne.nbOfCellsAliveNearMe++;
      xEqualToWMinusOneYEqualToHMinusTwo.nbOfCellsAliveNearMe++;
      initialCell.nbOfCellsAliveNearMe++;
      xEqualToZeroYEqualToOne.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToOne.nbOfCellsAliveNearMe++;

    }

    
    let xEqualToWMinusTwoYEqualToHMinusTwo = this.findCellAccordingToPos(cells,w-2,h-2);
    let xEqualToWMinusTwoYEqualToHMinusOne = this.findCellAccordingToPos(cells,w-2,h-1);


    //righBottomCell

    if(righBottomCell.alive){

      leftBottomCell.nbOfCellsAliveNearMe++;
      xEqualToZeroYEqualToHMinusTwo.nbOfCellsAliveNearMe++;
      initialCell.nbOfCellsAliveNearMe++;
      xEqualToWminusOneYEqualToZero.nbOfCellsAliveNearMe++;
      xEqualToWminusTwoYEqualToZero.nbOfCellsAliveNearMe++;
      xEqualToWMinusOneYEqualToHMinusTwo.nbOfCellsAliveNearMe++;
      xEqualToWMinusTwoYEqualToHMinusTwo.nbOfCellsAliveNearMe++;
      xEqualToWMinusTwoYEqualToHMinusOne.nbOfCellsAliveNearMe++;

    }*/

   

    for(c = 0; c < cells.length; c++){

      cell = cells[c];
      cellPos = cell.pos;
      
      if( cell.pos.x >= 0 && cell.pos.y >= 0 && cell.pos.x <= w - 1  && cell.pos.y <= h - 1 ){

        cell.nbOfCellsAliveNearMe = 0;

        let xMinusOneyMinusOne = this.findCellAccordingToPos(cells, cell.pos.x - 1, cell.pos.y - 1);
        let xMinusOney = this.findCellAccordingToPos(cells, cell.pos.x - 1, cell.pos.y );
        let xMinusOneyPlusOne = this.findCellAccordingToPos(cells, cell.pos.x - 1, cell.pos.y + 1);
        let xyMinusOne = this.findCellAccordingToPos(cells, cell.pos.x ,cell.pos.y - 1);
        let xyPlusOne = this.findCellAccordingToPos(cells, cell.pos.x ,cell.pos.y + 1);
        let xPlusOneyMinusOne = this.findCellAccordingToPos(cells, cell.pos.x + 1,cell.pos.y - 1);
        let xPlusOney = this.findCellAccordingToPos(cells, cell.pos.x + 1,cell.pos.y );
        let xPlusOneyPlusOne = this.findCellAccordingToPos(cells, cell.pos.x + 1,cell.pos.y + 1);

        

        //boundarie left
        if(cell.pos.x === 0 && cell.pos.y > 0 && cell.pos.y < h){
          let xPlusWidthy = this.findCellAccordingToPos(cells, w - 1, cell.pos.y);
          if( xPlusWidthy !== undefined && xPlusWidthy.alive ){
            cell.nbOfCellsAliveNearMe++;
          }
          let xPlusWidthyMinusOne = this.findCellAccordingToPos(cells, w - 1, cell.pos.y - 1);
          if( xPlusWidthyMinusOne !== undefined && xPlusWidthyMinusOne.alive ){
            cell.nbOfCellsAliveNearMe++;
          }
          let xPlusWidthyPlusOne = this.findCellAccordingToPos(cells, w - 1, cell.pos.y + 1);
          if( xPlusWidthyPlusOne !== undefined && xPlusWidthyPlusOne.alive ){
            cell.nbOfCellsAliveNearMe++;
          }
        }
        //boundarie right
        if(cell.pos.x === w - 1 && cell.pos.y > 0 && cell.pos.y < h){
          let xEqualToZeroy = this.findCellAccordingToPos(cells, 0, cell.pos.y);
          if( xEqualToZeroy !== undefined && xEqualToZeroy.alive ){
            cell.nbOfCellsAliveNearMe++;
          }
          let xEqualToZeroyMinusOne = this.findCellAccordingToPos(cells, 0, cell.pos.y - 1);
          if( xEqualToZeroyMinusOne !== undefined && xEqualToZeroyMinusOne.alive ){
            cell.nbOfCellsAliveNearMe++;
          }
          let xEqualToZeroyPlusOne = this.findCellAccordingToPos(cells, 0, cell.pos.y + 1);
          if( xEqualToZeroyPlusOne !== undefined && xEqualToZeroyPlusOne.alive ){
            cell.nbOfCellsAliveNearMe++;
          }
        }

        if( xMinusOneyMinusOne !== undefined && xMinusOneyMinusOne.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if( xMinusOney !== undefined && xMinusOney.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if(xMinusOneyPlusOne !== undefined && xMinusOneyPlusOne.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if(xyMinusOne !== undefined &&  xyMinusOne.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if(xyPlusOne !== undefined && xyPlusOne.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if(xPlusOneyMinusOne !== undefined && xPlusOneyMinusOne.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if(xPlusOney !== undefined && xPlusOney.alive){
          cell.nbOfCellsAliveNearMe++;
        }
        if(xPlusOneyPlusOne !== undefined && xPlusOneyPlusOne.alive){
          cell.nbOfCellsAliveNearMe++;
        }
      }
    }
    // boundarie top
    for(c = 0; c < w - 1; c++){
        cell = cells[c];
        if(cell.pos.y === 0 && cell.pos.x > 0 && cell.pos.x < w){
          let xyEqualTohMinusOne = this.findCellAccordingToPos(cells, cell.pos.x, h - 1);
          if( xyEqualTohMinusOne !== undefined && cell.alive ){
            xyEqualTohMinusOne.nbOfCellsAliveNearMe++;
          }
          let xMinusOneyEqualTohMinusOne = this.findCellAccordingToPos(cells, cell.pos.x - 1, h - 1);
          if( xMinusOneyEqualTohMinusOne !== undefined && cell.alive ){
            xMinusOneyEqualTohMinusOne.nbOfCellsAliveNearMe++;
          }
          let xPlusOneyEqualtohMinusOne = this.findCellAccordingToPos(cells, cell.pos.x + 1, h - 1 );
          if( xPlusOneyEqualtohMinusOne !== undefined && cell.alive ){
            xPlusOneyEqualtohMinusOne.nbOfCellsAliveNearMe++;
          }
        }
      //console.log(this.findCellAccordingToPos(cells, 2, h - 1));
    }

    //boundarie down
    for(c = w*(h-1); c < w*h; c++){
      cell = cells[c];
      if(cell.pos.y === h-1 && cell.pos.x > 0 && cell.pos.x < w){
        let xyEqualToZero = this.findCellAccordingToPos(cells, cell.pos.x, 0);
        if( xyEqualToZero !== undefined && cell.alive ){
          xyEqualToZero.nbOfCellsAliveNearMe++;
        }
        let xMinusOneyEqualToZero = this.findCellAccordingToPos(cells, cell.pos.x - 1, 0);
        if( xMinusOneyEqualToZero !== undefined && cell.alive ){
          xMinusOneyEqualToZero.nbOfCellsAliveNearMe++;
        }
        let xPlusOneyEqualtoZero = this.findCellAccordingToPos(cells, cell.pos.x + 1, 0 );
        if( xPlusOneyEqualtoZero !== undefined && cell.alive ){
          xPlusOneyEqualtoZero.nbOfCellsAliveNearMe++;
        }
      }
      //console.log(this.findCellAccordingToPos(cells, 2, 0));
    }

    console.log(initialCell);

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
          <Col xs="6" sm="2"><div className="simulation-number"> Game { this.nbSimulation }</div></Col>
          <Col xs="6" sm="2"><Button className="btn" color={this.state.btnState.btnColor} onClick={() => {this.golIsRunning ?  this.pauseGoL() : this.runGoL()}}>{ this.state.btnState.btnLabel }</Button></Col>
          <Col xs="6" sm="2"><Button className="btn" color="danger" onClick={() => {this.wipeOut()}}>CLEAR</Button></Col>
          <Col xs="6" sm="2"><Button className="btn" color="info" onClick={() => {this.generateRandFrame()}}>RAMDOM</Button></Col>
          <Col xs="6" sm="2">
            <Form> 
              <FormGroup> 
                <Input className="select-form" type="select" name="select" id="exampleSelect" onChange={(e) => {this.swapForm(e)}}> 
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
