export class GlobalEventDistributor {
  constructor() {
    this.stores = [];
  }

  registerStore(store) {
    this.stores.push(store);
  }

  dispatch(event) {
    this.stores.forEach(s => {
      s.dispatch(event);
      setTimeout(() => s.dispatch({ type: 'REFRESH' }));
    });
    // console.log('GlobalEventDistributor.dispatch', event, this.stores);
  }
  getState() {
    // 通过 GlobalEventDistributor.getState() 返回整个站点的 state
    let state = {};
    this.stores.forEach(s => {
      let currentState = s.getState();
      state[currentState.namespace] = currentState;
    });
    return state;
  }
}
