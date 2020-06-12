import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin } from 'antd';
import moment from 'moment';
import { MainContainer, ConsoleHeader, TableOperations } from 'fregata';
import api from 'api';
import Item from './Item';
import Footer from './Footer';
import { weekLabel } from './enums';

import './style/index.less';

const useTodoWorkflowData = () => {
  const [todoWorkflows, setTodoWorkflows] = useState(null);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(false);

  const load = async () => {
    try {
      setPending(true);
      const res = await api.post(`/hflow/api/workflow/processinstance/flow/getHandleList`, {
        data: { queryValue: '', pageNum: 1, pageSize: 10 },
      });
      setTotal(res?.data?.data?.total);
      setTodoWorkflows(res?.data?.data?.list);
    } finally {
      setPending(false);
    }
  };

  return [todoWorkflows, { pending, load, total }];
};

const useNoticeData = () => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(false);

  const load = async () => {
    try {
      setPending(true);
      const res = await api.get(`/clock/api/notice/select_notice`, {
        params: { pageNum: 1, pageSize: 10 },
      });
      setTotal(res?.data?.data?.total);
      setList(res?.data?.data?.list);
    } finally {
      setPending(false);
    }
  };

  return { list, pending, load, total };
};

const useInboxData = () => {
  const [list, setList] = useState(null);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(false);

  const load = async () => {
    try {
      setPending(true);
      const res = await api.get(`/box/api/inbox/inbox_list`, {
        params: { pageNum: 1, pageSize: 10 },
      });
      setTotal(res?.data?.data?.total);
      setList(res?.data?.data?.list);
    } finally {
      setPending(false);
    }
  };

  return { list, pending, load, total };
};

const useScheduleData = () => {
  const [list, setList] = useState([]);
  const [pending, setPending] = useState(false);

  const load = async () => {
    try {
      setPending(true);
      const res = await api.get(`/clock/api/schedule/get_my_schedule`, {
        params: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        },
      });
      const list = Array.isArray(res?.data?.data) ? [...res.data.data] : [];
      list.sort((a, b) => (moment(a.startDate).isBefore(moment(b.startDate)) ? -1 : 1));
      setList(list);
    } finally {
      setPending(false);
    }
  };

  return { list, pending, load };
};

const cardStyle = {
  bodyStyle: { padding: '16px' },
  headStyle: { padding: '0 16px' },
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 12 },
};

function Home(props) {
  const { history } = props;

  const [
    todoWorkflows,
    { pending: loadingTodoWorkflows, load: loadTodoWorkflows, total: totalTodoWorkflows },
  ] = useTodoWorkflowData();

  const {
    list: noticeList,
    pending: loadingNoticeList,
    load: loadNoticeList,
    total: totalNotice,
  } = useNoticeData();

  const {
    list: inboxList,
    pending: loadingInboxList,
    load: loadInboxList,
    total: totalInboxList,
  } = useInboxData();

  const {
    list: scheduleList,
    pending: loadingScheduleList,
    load: loadScheduleList,
  } = useScheduleData();

  useEffect(() => {
    loadTodoWorkflows();
    loadNoticeList();
    loadInboxList();
    loadScheduleList();
  }, []);

  return (
    <MainContainer
      isBody={true}
      className='bg-white homepage'
      style={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <Row gutter={16}>
        <Col {...colLayout}>
          <Card
            {...cardStyle}
            className='content-card'
            hoverable
            title='待办流程'
            extra={
              <a
                onClick={() => {
                  history.push(`/workflow-app/flow-list/todo`);
                }}
              >
                更多
              </a>
            }
          >
            <Spin spinning={loadingTodoWorkflows}>
              <div style={{ minHeight: 160 }}>
                {todoWorkflows?.slice(0, 5)?.map(ele => {
                  return (
                    <Item
                      onClick={()=>{
                        window.open(`${window.location.origin}/workflow-app-full/flows/process/${ele.taskId}/todo`)
                      }}
                      badge='default'
                      key={ele.taskId}
                      text={ele.processInstanceName}
                      userName={ele.startUserName}
                      time={moment(ele?.startDate).format('YYYY-MM-DD')}
                    />
                  );
                })}
                {totalTodoWorkflows ? (
                  <Footer text={`共有 ${totalTodoWorkflows} 条待办流程`} />
                ) : null}
              </div>
            </Spin>
          </Card>
        </Col>
        <Col {...colLayout}>
          <Card
            {...cardStyle}
            className='content-card'
            hoverable
            title='今日日程'
            extra={
              <a
                onClick={() => {
                  history.push(`/schedule-app/my-schedule`);
                }}
              >
                更多
              </a>
            }
          >
            <Spin spinning={loadingScheduleList}>
              <div style={{ minHeight: 160 }}>
                <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 12 }}>
                  {weekLabel[moment().isoWeekday()]}
                  {`（${moment().format('YYYY-MM-DD')}）`}
                </div>
                {scheduleList?.map(ele => {
                  const todayDate = moment();
                  const startDate = moment(ele?.startDate);
                  const endDate = moment(ele?.endDate);
                  const startTime = todayDate.isSame(startDate, 'day')
                    ? startDate.format('HH:mm')
                    : '00:00';
                  const endTime = todayDate.isSame(endDate, 'day')
                    ? endDate.format('HH:mm')
                    : '24:00';
                  return (
                    <Item
                      badge='default'
                      key={ele.id}
                      text={`${startTime} - ${endTime}   ${ele.content}`}
                    />
                  );
                })}
              </div>
            </Spin>
          </Card>
        </Col>
        {/* <Col {...colLayout}>
          <Card
            {...cardStyle}
            className='content-card'
            hoverable
            title='通知公告'
            extra={
              <a
                onClick={() => {
                  history.push(`/notice-app/notice-list`);
                }}
              >
                更多
              </a>
            }
          >
            <Spin spinning={loadingNoticeList}>
              <div style={{ minHeight: 160 }}>
                {noticeList?.slice(0, 6)?.map(ele => {
                  return (
                    <Item
                      onClick={() => {
                        history.push(`/notice-app/noticeDetail/${ele.id}`);
                      }}
                      badge='default'
                      key={ele.id}
                      text={ele.noticeTitle}
                      time={moment(ele?.applicantDate).format('YYYY-MM-DD')}
                    />
                  );
                })}
              </div>
            </Spin>
          </Card>
        </Col> */}
      </Row>

      {/* <Row gutter={16} style={{ marginTop: 16 }}>
        <Col {...colLayout}>
          <Card
            {...cardStyle}
            className='content-card'
            hoverable
            title='收到签发材料'
            extra={
              <a
                onClick={() => {
                  history.push(`/box-app/inbox`);
                }}
              >
                更多
              </a>
            }
          >
            <Spin spinning={loadingInboxList}>
              <div style={{ minHeight: 160 }}>
                {inboxList?.slice(0, 5)?.map(ele => {
                  return (
                    <Item
                      onClick={() => {
                        history.push(`/box-app/inbox/detail/${ele.id}`);
                      }}
                      badge='default'
                      key={ele.id}
                      text={ele.title}
                      userName={ele.createUserName}
                      time={moment(ele?.createDate).format('YYYY-MM-DD')}
                    />
                  );
                })}
                {totalInboxList ? <Footer text={`共有 ${totalInboxList} 条传阅`} /> : null}
              </div>
            </Spin>
          </Card>
        </Col>
        
      </Row> */}
    </MainContainer>
  );
}

export default Home;
