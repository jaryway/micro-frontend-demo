import React from 'react';
import { combineReducers } from 'redux';
import { ReactReduxContext } from 'react-redux';

const isAarry = o => Object.prototype.toString.call(o) === '[object Array]';

const injectReducer = function(reducers, { forwardRef = false } = {}) {
  return function(WrappedComponent) {
    function WithStoreComponent({ forwardedRef, ...rest }) {
      return (
        <ReactReduxContext.Consumer>
          {({ store }) => {
            // do something with the store here
            // 在这里拿到Store，注入并替换 reducer
            store.injectedReducers = store.injectedReducers || {};
            const injectReducers = (isAarry(reducers) ? reducers : [reducers])
              .filter(({ key, reducer }) => {
                // Check `store.injectedReducers[key] === reducer` for
                // hot reloading when a key is the same but a reducer is different
                return !(
                  Reflect.has(store.injectedReducers, key) &&
                  store.injectedReducers[key] === reducer
                );
              })
              .reduce((prev, { key, reducer }) => {
                return { ...prev, [key]: reducer };
              }, {});

            const nextReducers = {
              ...store.injectedReducers,
              ...injectReducers,
            };
            store.injectedReducers = nextReducers;

            store.replaceReducer(
              combineReducers({
                ...nextReducers,
                ...store.globalReducers,
              })
            );

            return <WrappedComponent ref={forwardedRef} {...rest} />;
          }}
        </ReactReduxContext.Consumer>
      );
    }

    if (forwardRef) {
      return React.forwardRef((props, ref) => <WithStoreComponent forwardedRef={ref} {...props} />);
    }
    return props => <WithStoreComponent {...props} />;
  };
};

export default injectReducer;
