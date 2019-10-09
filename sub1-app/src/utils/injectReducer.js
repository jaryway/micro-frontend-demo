import React from 'react';
import { combineReducers } from 'redux';
import { ReactReduxContext } from 'react-redux';

const isAarry = o => Object.prototype.toString.call(o) === '[object Array]';

function injectReducer(reducers) {
  return Component => props => (
    <ReactReduxContext.Consumer>
      {({ store }) => {
        // do something with the store here
        // console.log(454545, store);
        // 在这里拿到Store，注入并替换 reducer
        store.injectedReducers = store.injectedReducers || {};
        const injectReducers = (isAarry(reducers) ? reducers : [reducers])
          .filter(({ key, reducer }) => {
            // Check `store.injectedReducers[key] === reducer` for
            // hot reloading when a key is the same but a reducer is different
            return !(
              Reflect.has(store.injectedReducers, key) && store.injectedReducers[key] === reducer
            );
          })
          .reduce((prev, { key, reducer }) => {
            return { ...prev, [key]: reducer };
          }, {});

        const nextReducers = { ...store.injectedReducers, ...injectReducers };
        store.injectedReducers = nextReducers;
        // console.log('nextReducers', nextReducers);
        store.replaceReducer(
          combineReducers({
            ...nextReducers,
            ...store.globalReducers,
          })
        );

        return <Component {...props} />;
      }}
    </ReactReduxContext.Consumer>
  );
}

export default injectReducer;
