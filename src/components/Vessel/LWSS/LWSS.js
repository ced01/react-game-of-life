import AbstractVessel from '../AbtractVessel';


export default class LWSS extends AbstractVessel {

    spaceTaken = 0;
    
    constructor(cells,cellOrigin,posInEnv,envWith) {
        super(cells,cellOrigin,posInEnv,envWith);
        this.spaceTaken = 4;
    }

    create(){
        if(!this.environement[this.cellOrigin].alive) {
            this.environement[this.cellOrigin].alive = true;
        }
        if(!this.environement[this.cellOrigin].alive) {
            this.environement[this.cellOrigin].alive = true;
        }
        if(this.cellOrigin + this.spaceTaken < this.environement.length && !this.environement[this.cellOrigin + this.spaceTaken].alive){
            this.environement[this.cellOrigin + this.spaceTaken].alive = true;
        }
        if(this.cellOrigin - this.envWith + this.spaceTaken < this.environement.length && !this.environement[this.cellOrigin - this.envWith + this.spaceTaken].alive){
            this.environement[this.cellOrigin - this.envWith + this.spaceTaken].alive = true;
        }
        if(this.cellOrigin && this.cellOrigin - 2*this.envWith > 0 && !this.environement[this.cellOrigin - 2 * this.envWith].alive){
            this.environement[this.cellOrigin - 2 * this.envWith].alive = true;
        }
        if(this.cellOrigin && this.cellOrigin - 2*this.envWith + this.spaceTaken - 1 > 0 && !this.environement[this.cellOrigin - 2 * this.envWith + this.spaceTaken - 1].alive){
            this.environement[this.cellOrigin - 2 * this.envWith + this.spaceTaken - 1].alive = true;
        }
        for(this.posInEnv = this.cellOrigin + this.envWith + 1 ; this.posInEnv <= this.cellOrigin + this.envWith + this.spaceTaken; this.posInEnv++) {
            if(this.posInEnv < this.environement.length && !this.environement[this.posInEnv].alive){
                this.environement[this.posInEnv].alive = true;
            }
        } 
    }
}