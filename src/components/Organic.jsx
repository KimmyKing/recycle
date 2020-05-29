import React, {Component} from 'react';
import {Button, Table, DatePicker, Modal, Form, Input, InputNumber, message, Row, Col} from "antd";
import axios from 'axios';
import moment from 'moment'
import style from './view.less';

const labelCol = {
  span: 5
};
const wrapperCol = {
  span: 15
};
const formRef = React.createRef();
class Organic extends Component {
  constructor() {
    super();
    this.state = {
      type: 1,
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
        if (res.data.code === 0) {
          this.setState({data: res.data.data, loading: false});
        }
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
    if (formRef.current) {
      formRef.current.resetFields();
    }
    this.setState({isAdd: false, showModal: true, selectedId: id}, () => {
      axios.get(`/front/api/v1/recycle/detail?id=${id}`).then(res => {
        const data = res.data.data;
        let innerData = {};
        if (data.wasteList.length) {
          innerData = data.wasteList[0];
        }
        formRef.current.setFieldsValue({
          address: data.address,
          date: moment(data.date),
          inWeight: innerData.inWeight || 0,
          inCars: innerData.inCars || 0,
          outWeight: innerData.outWeight || 0,
          outCars: innerData.outCars || 0,
          memo: innerData.memo,
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
        wasteList: [
          {
            code: 'organic',
            inWeight: values.inWeight || 0,
            inCars: values.inCars || 0,
            outWeight: values.outWeight || 0,
            outCars: values.outCars || 0,
            memo: values.memo || '',
          },
        ]
      };
      data.wasteList[0].sumCars = data.wasteList[0].inCars + data.wasteList[0].outCars;
      let request;
      if (isAdd) {
        request =  axios.post('/front/api/v1/recycle/add', data);
      } else {
        request =  axios.put(`/front/api/v1/recycle/update?id=${selectedId}`, data)
      }
      request.then(res => {
        this.setState({showModal: false}, () => {
          if (res.data.code === 0) {
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
          <Row>
            <Col span={12}>
              <Form.Item
                label="地点"
                name="address"
                initialValue="松隐"
                rules={[{required: true, message: '请输入地点'}]}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>

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
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="进场重量"
                name="inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="车数"
                name="inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="出货重量"
                name="outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="车数"
                name="outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="备注"
                name="memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <Input className={style.formItem} allowClear/>
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
        title: '进场重量',
        dataIndex: 'wasteList',
        key: 'inWeight',
        render: (wasteList) => (<div>{wasteList[0].inWeight}</div>)
      },
      {
        title: '车数',
        dataIndex: 'wasteList',
        key: 'inCars',
        render: (wasteList) => (<div>{wasteList[0].inCars}</div>)
      },
      {
        title: '出货重量',
        dataIndex: 'wasteList',
        key: 'outWeight',
        render: (wasteList) => (<div>{wasteList[0].outWeight}</div>)
      },
      {
        title: '车数',
        dataIndex: 'wasteList',
        key: 'outCars',
        render: (wasteList) => (<div>{wasteList[0].outCars}</div>)
      },
      {
        title: '总车数',
        dataIndex: 'wasteList',
        key: 'sumCars',
        render: (wasteList) => (<div>{wasteList[0].sumCars}</div>)
      },
      {
        title: '备注',
        dataIndex: 'wasteList',
        key: 'memo',
        render: (wasteList) => (<div>{wasteList[0].memo}</div>)
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
        style={{...this.props.style}}
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
              <Table.Summary.Cell>{data.sumInWeightorganic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsorganic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightorganic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsorganic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsorganic}</Table.Summary.Cell>
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

export default Organic;
