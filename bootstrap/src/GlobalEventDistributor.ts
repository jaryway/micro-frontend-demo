export class GlobalEventDistributor {
  stores: any[];
  constructor() {
    this.stores = [];
  }

  registerStore(store: any) {
    this.stores.push(store);
  }

  dispatch(event: { type: string; payload?: any }) {
    this.stores.forEach(s => {
      s.dispatch(event);
    });
    // console.log('GlobalEventDistributor.dispatch', event, this.stores);
  }
  getState() {
    // 通过 GlobalEventDistributor.getState() 返回整个站点的 state
    let state: any = {};
    this.stores.forEach(s => {
      const currentState: { namespace: string } = s.getState();
      state[currentState.namespace] = currentState;
    });
    return state;
  }
}
