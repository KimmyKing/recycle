import React, {Component} from 'react';
import {Button, Table, DatePicker, Select, Modal, Form, Input, InputNumber, message, Row, Col, Typography} from "antd";
import axios from 'axios';
import moment from 'moment'
import style from './view.less';

const labelCol = {
  span: 5
};
const wrapperCol = {
  span: 12
};
const formRef = React.createRef();
class Huge extends Component {
  constructor() {
    super();
    this.state = {
      type: 2,
      pageSize: 10,
      currentPage: 1,
      isAdd: false,
      showModal: false,
      loading: false,
      data: {},
      selectedId: '',
      params: {
        startDate: '',
        endDate: '',
        address: '',
        inOut: '',
      },
    }
  }

  componentDidMount() {
    this.getViewData();
  }

  getViewData = () => {
    this.setState({loading: true}, () => {
      const {type, pageSize, params, currentPage} = this.state;
      axios.get(`/front/api/v1/recycle/list?type=${type}&pageNo=${currentPage}&pageSize=${pageSize}`, {params}).then(res => {
        this.setState({data: res.data.data, loading: false});
      }).catch(err => {
        this.setState({loading: false}, () => {
          message.error('服务断开');
        });
      })
    })
  }

  paramsChanged = (type, e) => {
    const {params} = this.state;
    switch (type) {
      case 'startDate':
      case 'endDate':
        if (e) {
          params[type] = moment(e).format('YYYY-MM-DD');
        } else {
          params[type] = '';
        }
        break;
      case 'address':
        params[type] = e.target.value;
        break;
      case 'inOut':
        if (e === '0') {
          params[type] = '';
        } else {
          params[type] = e;
        }
        break;
      default:
    }
    this.setState({params});
  }

  clickSearchButton = () => {
    this.setState({currentPage: 1}, () => {
      this.getViewData();
    });
  }

  clickAddButton = () => {
    this.setState({isAdd: true, showModal: true}, () => {
      if (formRef.current) {
        formRef.current.resetFields();
      }
    });
  }

  clickEditButton = (id) => {
    this.setState({isAdd: false, showModal: true, selectedId: id}, () => {
      axios.get(`/front/api/v1/recycle/detail?id=${id}`).then(res => {
        const data = res.data.data;
        formRef.current.setFieldsValue({
          address: data.address,
          date: moment(data.date),
          inOut: data.inOut,
          sumWeight: data.sumWeight || 0,
          sumMoney: data.sumMoney || 0,
        });
      });
    });
  }

  clicDeleteButton = (id) => {
    axios.delete(`/front/api/v1/recycle/delete?id=${id}`).then(res => {
      if (res.data.code === 0) {
        this.getViewData();
      } else {
        message.error('删除失败');
      }
    }).catch(err => {
      message.error('服务断开');
    })
  }

  submit = () => {
    formRef.current.validateFields().then(values => {
      const {type, isAdd, selectedId} = this.state;
      const data = {
        type,
        address: values.address,
        date: moment(values.date).format('YYYY-MM-DD'),
        inOut: values.inOut,
        sumMoney: values.sumMoney,
        sumWeight: values.sumWeight,
      };
      let request;
      if (isAdd) {
        request =  axios.post('/front/api/v1/recycle/add', data);
      } else {
        request =  axios.put(`/front/api/v1/recycle/update?id=${selectedId}`, data)
      }
      request.then(res => {
        this.setState({showModal: false}, () => {
          if (res.data.code === 0) {
            formRef.current.resetFields();
            this.getViewData();
          } else {
            message.error('请求失败');
          }
        })
      }).catch(err => {
        message.error('服务断开');
      })
    }).catch(err => {

    })
  }

  configureModal = () => {
    const {isAdd, showModal} = this.state;
    return (
      <Modal
        title={`${isAdd ? '新增' : '编辑'}数据`}
        visible={showModal}
        width={800}
        onCancel={() => this.setState({showModal: false})}
        onOk={this.submit.bind(this)}
      >
        <Form ref={formRef}>
          <Form.Item
            label="地点"
            name="address"
            rules={[{required: true, message: '请输入地点'}]}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input className={style.formItem} allowClear/>
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item
                label="日期"
                name="date"
                rules={[{required: true, message: '请选择日期'}]}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <DatePicker/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="收/出"
                name="inOut"
                rules={[{required: true, message: '请选择收出'}]}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <Select className={style.formItem} >
                  <Select.Option key={1}>收</Select.Option>
                  <Select.Option key={2}>出</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="重量"
                name="sumWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="金额"
                name="sumMoney"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }

  configureSearchView = () => {
    return (
      <div style={{padding: '10px 0', display: 'flex'}}>
        <div className={style.search_title}>开始时间：</div>
        <DatePicker  onChange={this.paramsChanged.bind(this, 'startDate')}/>
        <div className={style.search_title}>结束时间：</div>
        <DatePicker  onChange={this.paramsChanged.bind(this, 'endDate')}/>

        <div className={style.search_title}>地点：</div>
        <Input placeholder="请输入地点" allowClear style={{width: '150px'}} onChange={this.paramsChanged.bind(this, 'address')}/>

        <div className={style.search_title}>收/出：</div>
        <Select style={{width: '70px'}} onChange={this.paramsChanged.bind(this, 'inOut')}>
          <Select.Option key={0}>全部</Select.Option>
          <Select.Option key={1}>收</Select.Option>
          <Select.Option key={2}>出</Select.Option>
        </Select>
        <Button className={style.search_btn} type="primary" onClick={this.clickSearchButton}>查询</Button>
      </div>
    )
  }


  getColumns = () => {
    return [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: '地点',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '收/出',
        dataIndex: 'inOut',
        key: 'inOut',
        render: inOut => (<div>{inOut === '1' ? '收' : '出'}</div>)
      },
      {
        title: '重量',
        dataIndex: 'sumWeight',
        key: 'sumWeight',
      },
      {
        title: '金额',
        dataIndex: 'sumMoney',
        key: 'sumMoney',
      },
      {
        dataIndex: 'id',
        render: id => (
          <div>
            <Button type="primary" onClick={this.clickEditButton.bind(this, id)}>编辑</Button>
            <Button type="danger" style={{margin: '0 0 0 10px'}} onClick={this.clicDeleteButton.bind(this, id)}>删除</Button>
          </div>
        )
      }
    ]
  }

  configureTableView = () => {
    const {pageSize, loading, data, currentPage} = this.state;
    return (
      <Table
        style={{float: 'right', width: '80%'}}
        loading={loading}
        dataSource={data.list}
        columns={this.getColumns()}
        bordered
        pagination={{pageSize: pageSize, current: currentPage, total: data.total}}
        onChange={({current}) => {
          this.setState({currentPage: current}, () => {});
          this.getViewData();
        }}
        summary={pageData => {
          let totalBorrow = 0;
          let totalRepayment = 0;
          pageData.forEach(({ borrow, repayment }) => {
            totalBorrow += borrow;
            totalRepayment += repayment;
          });

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell>总计</Table.Summary.Cell>
              <Table.Summary.Cell/>
              <Table.Summary.Cell/>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigth}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoney}</Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    )
  }

  render() {
    return (
      <div>
        {this.configureModal()}
        {this.configureSearchView()}
        <Button className={style.add_btn} type="primary" onClick={this.clickAddButton}>新增</Button>
        {this.configureTableView()}
      </div>
    )
  }
}

export default Huge;
