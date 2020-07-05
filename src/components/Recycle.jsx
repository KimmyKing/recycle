import React, {Component} from 'react';
import {Button, Table, DatePicker, Select, Modal, Form, Input, InputNumber, message, Row, Col} from "antd";
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
class Recycle extends Component {
  constructor() {
    super();
    this.state = {
      type: 4,
      pageSize: 20,
      currentPage: 1,
      isAdd: false,
      showModal: false,
      loading: false,
      data: {},
      detail: {},
      selectedId: '',
      params: {
        startDate: '',
        endDate: '',
        address: '',
        inOut: '',
      },
      searchLoading: false,
      totalData: {},
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

  getTotalData = () => {
    this.setState({searchLoading: true}, (res) => {
      const {type, params} = this.state;
      axios.get(`/front/api/v1/recycle/list?type=${type}`, {params}).then(res => {
        if (res.data.code === 0) {
          this.setState({totalData: res.data.data, searchLoading: false});
        }
      }).catch(err => {
        this.setState({searchLoading: false}, () => {
          message.error('服务断开');
        });
      })
    });
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
      this.getTotalData();
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
        const value = {
          address: data.address,
          date: moment(data.date),
          inOut: data.inOut,
        };
        data.wasteList.map((v) => {
          if (v.code === 'metal') {
            value.metal_weight = v.weight;
            value.metal_price = v.money;
          }
          if (v.code === 'plastic') {
            value.plastic_weight = v.weight;
            value.plastic_price = v.money;
          }
          if (v.code === 'paper') {
            value.paper_weight = v.weight;
            value.paper_price = v.money;
          }
          if (v.code === 'textile') {
            value.textile_weight = v.weight;
            value.textile_price = v.money;
          }
          if (v.code === 'glass') {
            value.glass_weight = v.weight;
            value.glass_price = v.money;
          }
          if (v.code === 'appliance') {
            value.appliance_weight = v.weight;
            value.appliance_price = v.money;
          }
          if (v.code === 'others') {
            value.others_weight = v.weight;
            value.others_price = v.money;
          }
        });
        formRef.current.setFieldsValue(value);
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
        wasteList: [],
      };
      let sumMoney = 0;
      let sumWeight = 0;
      if (values.metal_weight || values.metal_price) {
        const model = {
          code: 'metal',
          weight: values.metal_weight || 0,
          money: values.metal_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      if (values.plastic_weight || values.plastic_price) {
        const model = {
          code: 'plastic',
          weight: values.plastic_weight || 0,
          money: values.plastic_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      if (values.paper_weight || values.paper_price) {
        const model = {
          code: 'paper',
          weight: values.paper_weight || 0,
          money: values.paper_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      if (values.textile_weight || values.textile_price) {
        const model = {
          code: 'textile',
          weight: values.textile_weight || 0,
          money: values.textile_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      if (values.glass_weight || values.glass_price) {
        const model = {
          code: 'glass',
          weight: values.glass_weight || 0,
          money: values.glass_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      if (values.appliance_weight || values.appliance_price) {
        const model = {
          code: 'appliance',
          weight: values.appliance_weight || 0,
          money: values.appliance_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      if (values.others_weight || values.others_price) {
        const model = {
          code: 'others',
          weight: values.others_weight || 0,
          money: values.others_price || 0,
        };
        data.wasteList.push(model);
        sumWeight += model.weight;
        sumMoney += model.money;
      }
      data.sumMoney = sumMoney.toFixed(2);
      data.sumWeight = sumWeight.toFixed(2);
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
    const {isAdd, showModal, detail} = this.state;
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
                label="废金属重量"
                name="metal_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="废金属价格"
                name="metal_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0}  style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="废塑料重量"
                name="plastic_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="废塑料价格"
                name="plastic_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="废纸张重量"
                name="paper_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="废纸张价格"
                name="paper_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="废织物重量"
                name="textile_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="废织物价格"
                name="textile_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="废玻璃重量"
                name="glass_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="废玻璃价格"
                name="glass_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item></Col>
          </Row>

          <Row>
          <Col span={12}>
            <Form.Item
              label="废家电重量"
              name="appliance_weight"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            >
              <InputNumber min={0} style={{width: '100%'}} precision={2}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="废家电价格"
              name="appliance_price"
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            >
              <InputNumber min={0} style={{width: '100%'}} precision={2}/>
            </Form.Item>
          </Col>
        </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="其它重量"
                name="others_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="其它价格"
                name="others_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }

  configureSearchView = () => {
    const {searchLoading} = this.state;
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

        <Button className={style.search_btn} type="primary" loading={searchLoading} onClick={this.clickSearchButton}>查询</Button>
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
        title: '合计重量',
        dataIndex: 'sumWeight',
        key: 'sumWeight',
      },
      {
        title: '合计金额',
        dataIndex: 'sumMoney',
        key: 'sumMoney',
      },
      {
        title: '废金属',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'metalWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'metalMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
      },
      {
        title: '废塑料',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'plasticWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'plasticMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
      },
      {
        title: '废纸张',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'paperWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'paperMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
      },
      {
        title: '废织物',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'textileWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'textileMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
      },
      {
        title: '废玻璃',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'glassWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'glassMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
      },
      {
        title: '废家电',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'applianceWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'applianceMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
      },
      {
        title: '其它',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteList',
            key: 'othersWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.weight}</div>
                }
              })
            )
          },
          {
            title: '金额',
            dataIndex: 'wasteList',
            key: 'othersMoney',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.money}</div>
                }
              })
            )
          },
        ],
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
    const {pageSize, loading, data, totalData, currentPage} = this.state;
    return (
      <Table
        style={{...this.props.style}}
        loading={loading}
        dataSource={data.list}
        columns={this.getColumns()}
        bordered
        scroll={{x: 'max-content'}}
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
              <Table.Summary.Cell>{totalData.sumSumWeight}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoney}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightPaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyPaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumWeightOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{totalData.sumSumMoneyOthers}</Table.Summary.Cell>
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

export default Recycle;
