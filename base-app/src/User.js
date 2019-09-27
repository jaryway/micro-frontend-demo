import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

export default ({ match }) => {
  //   console.log('employeeInde', List, List1);
  return (
    <Switch>
      {/* <Route path={`${rootUrl}/list/status1`} component={DisabledListAsync} /> */}
      <Route
        path={`${match.path}/list/:type?`}
        render={props => {
          console.log('employeeIndex');
          return <div {...props}>45454545</div>;
        }}
        // component={EmployeeListAsync}
      />
      {/* <Route path={`${rootUrl}/edit`} component={EmployeeNormalFormAsync} /> */}
      <Redirect to={`${match.path}/list/1`} />
    </Switch>
  );
};
