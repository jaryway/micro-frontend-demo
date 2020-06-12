import api from 'api';

export default {
  // 获取当前用户
  GET_CURRENT: data =>
    data
      ? Promise.resolve({ data })
      : api('/his-omp/api/employee/currentEmp').then(resp => resp.data),
};
