export enum States {
  IDLE = "Idle",
  WALKING = "Walking",
  JUMPING = "Jumping",
}

class StateMachine {
  state: States;
  initFunctions: { [state: string]: (oldState: States) => void };
  runtimeFunctions: { [state: string]: () => void };
  stateRules: {[state: string]: Array<string>}

  constructor() {
    this.state = States.IDLE;
    this.initFunctions = {};
    this.runtimeFunctions = {};
    this.stateRules = {};
  }

  changeState(newState: States): void {
    if (newState === this.state) {
      console.error("Unable to change to same state!");
      return;
    }

    if(this.initFunctions[newState]){
	    this.initFunctions[newState](this.state)
    }

    this.state = newState
  }

  addInitFunction(state: States, func_: (oldState: States) => void){
	  this.initFunctions[state] = func_
  }
}

export default StateMachine;
