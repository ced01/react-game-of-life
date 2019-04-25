
export default class Environement {
    
    width = 0;
    height = 0;
    content = [];
    initialCellState = false;
    nbOfcellsAliveNearMe = 0;

    constructor(width,height,initialCellState) {
        this.width = width;
        this.height = height;
        this.initialCellState = initialCellState;
        this.content = this.initialise();
    }
    
    initialise(){
        let ih = 0, iw = 0, arr =[];
        for(ih = 0; ih < this.height; ih++ ) {
            for(iw = 0; iw < this.width; iw++ ) {
                //if(posx !== this.width - 1  && posy !== ghmo && posx !== 0 && posy !== 0)*/)
                arr.push({alive : this.initialCellState , pos : {x:iw , y:ih}, nbOfCellsAliveNearMe:this.nbOfcellsAliveNearMe});
            }
        }
        return arr;
    }

    getWidth(){
        return this.width;
    }
    getHeight(){
        return this.height;
    }
    getContent(){
        return this.content;
    }
}