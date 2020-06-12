export class GlobalEventDistributor {
  constructor() {
    this.stores = [];
  }

  registerStore(store) {
    this.stores.push(store);
  }

  dispatch(event) {
    // console.log('GlobalEventDistributor.dispatch', event);
    this.stores.forEach((s) => {
      s.dispatch(event);
      setTimeout(() => s.dispatch({ type: 'REFRESH' }));
    });
  }
  getState() {
    // 通过 GlobalEventDistributor.getState() 返回整个站点的 state
    const state = {};
    this.stores.forEach((s) => {
      const currentState = s.getState();
      state[currentState.namespace] = currentState;
    });
    return state;
  }
}
