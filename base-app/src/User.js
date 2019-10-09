import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

export default ({ match }) => {
  //   console.log('employeeInde', List, List1);
  return (
    <Switch>
      <Route
        path={`${match.path}/list/:type?`}
        render={props => {
          console.log('employeeIndex');
          return <div>User</div>;
        }}
        // component={EmployeeListAsync}
      />
      <Redirect to={`${match.path}/list/1`} />
    </Switch>
  );
};
