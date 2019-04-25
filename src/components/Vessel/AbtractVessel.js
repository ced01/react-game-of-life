
export default class AbtractVessel {

    environement = [];
    cellOrigin = null;
    posInEnv = 0;
    spaceTaken = 0;
    envWith = 0;

    constructor(env,cellOrigin,posInEnv,envWith){
        if (this.constructor === "AbstractConfig") {
            throw new TypeError('Abstract class "AbstractConfig" cannot be instantiated directly');
        }else{
            this.environement = env;
            this.cellOrigin = cellOrigin;
            this.posInEnv = posInEnv;
            this.envWith = envWith;
        }
    }

    setOrigin(origin){
        this.cellOrigin = origin;
    }
}