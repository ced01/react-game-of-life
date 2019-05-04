
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
        let ih = 0, iw = 0, arr =[], id = 0;
        for(ih = 0; ih < this.height; ih++ ) {
            for(iw = 0; iw < this.width; iw++ ) {
                id++;
                //if(posx !== this.width - 1  && posy !== ghmo && posx !== 0 && posy !== 0)*/)
                arr.push({alive : this.initialCellState , pos : {x:iw , y:ih}, nbOfCellsAliveNearMe:this.nbOfcellsAliveNearMe});
            }
        }
        return arr;
    }

    generateFrameAtPos(index){
        let x = 0, y = 0, xmo = 0, ymo = 0, xmt = 0, ymt = 0, xpo = 0, ypo = 0, xpt = 0, xpth = 0;
        
        if(index === null) {
            x = Math.floor(Math.random()*this.width-1);
            y = Math.floor(Math.random()*this.height-1);
        }else{
            x = this.content[index].pos.x;
            y = this.content[index].pos.y;
            
        }
        xmo = x > 0 ?  x - 1  : x + this.width - 1;
        ymo = y > 0 ? y - 1 : y + this.height - 1;
        xmt = x > 1 ?  x - 2  : x + this.width;
        ymt = y > 1 ? y - 2 : y + this.height;
        xpo = x < this.width  ? x + 1 : 0; 
        ypo = y < this.height ? y + 1 : 0;
        xpt = x < (this.width - 1)  ? x + 2 : 1; 
        xpth = x < (this.width - 2)  ? x + 3 : 2; 
        console.log([{x:xmo,y:y},{x:x,y:y},{x:xpo,y:y}]);
        return [
            [{x:xmo,y:y},{x:x,y:y},{x:xpo,y:y}],
            [{x:xmt,y:y},{x:xmo,y:y},{x:x,y:y},{x:xpo,y:y}],
            [{x:xmt,y:y},{x:xmo,y:y},{x:x,y:y},{x:xpo,y:y},{x:xpt,y:y}],
            [{x:xpth,y:y},{x:xpt,y:y},{x:xpo,y:y},{x:x,y:ymo},{x:x,y:y},{x:xmo,y:y}],
            [{x:xmo,y:ypo},{x:x,y:ypo},{x:x,y:y},{x:xpo,y:y},{x:xpo,y:ymo},{x:xpt,y:ymo}],
            [{x:x,y:ypo},{x:xmo,y:y},{x:x,y:y},{x:x,y:ymo},{x:xpo,y:ymo}]
        ];
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
    setContent(content){
        this.content = content;
    }
}