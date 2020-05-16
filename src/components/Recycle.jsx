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
class Recycle extends Component {
  constructor() {
    super();
    this.state = {
      type: 4,
      pageSize: 10,
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
          metal_weight: data.wasteMetalModel ? data.wasteMetalModel.weight : 0,
          metal_price: data.wasteMetalModel ? data.wasteMetalModel.money : 0,
          plastic_weight: data.wastePlasticModel ? data.wastePlasticModel.weight : 0,
          plastic_price: data.wastePlasticModel ? data.wastePlasticModel.money : 0,
          paper_weight: data.wastePaperModel ? data.wastePaperModel.weight : 0,
          paper_price: data.wastePaperModel ? data.wastePaperModel.money : 0,
          fabric_weight: data.wasteTextileModel ? data.wasteTextileModel.weight : 0,
          fabric_price: data.wasteTextileModel ? data.wasteTextileModel.money : 0,
          glass_weight: data.wasteGlassModel ? data.wasteGlassModel.weight : 0,
          glass_price: data.wasteGlassModel ? data.wasteGlassModel.money : 0,
          home_appliances_weight: data.wasteApplianceModel ? data.wasteApplianceModel.weight : 0,
          home_appliances_price: data.wasteApplianceModel ? data.wasteApplianceModel.money : 0,
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
      };
      let sumMoney = 0;
      let sumWeight = 0;
      if (values.metal_weight || values.metal_price) {
        const wasteMetalModel = {};
        wasteMetalModel.weight = values.metal_weight ? parseFloat(values.metal_weight) : 0;
        wasteMetalModel.money =  values.metal_price ? parseFloat(values.metal_price) :  0;
        data.wasteMetalModel = wasteMetalModel;
        sumWeight += wasteMetalModel.weight;
        sumMoney += wasteMetalModel.money;
      }
      if (values.plastic_weight || values.plastic_price) {
        const wastePlasticModel = {};
        wastePlasticModel.weight = values.plastic_weight ? parseFloat(values.plastic_weight) : 0;
        wastePlasticModel.money =  values.plastic_price ? parseFloat(values.plastic_price) :  0;
        data.wastePlasticModel = wastePlasticModel;
        sumWeight += wastePlasticModel.weight;
        sumMoney += wastePlasticModel.money;
      }
      if (values.paper_weight || values.paper_price) {
        const wastePaperModel = {};
        wastePaperModel.weight = values.paper_weight ? parseFloat(values.paper_weight) : 0;
        wastePaperModel.money =  values.paper_price ? parseFloat(values.paper_price) :  0;
        data.wastePaperModel = wastePaperModel;
        sumWeight += wastePaperModel.weight;
        sumMoney += wastePaperModel.money;
      }
      if (values.fabric_weight || values.fabric_price) {
        const wasteTextileModel = {};
        wasteTextileModel.weight = values.fabric_weight ? parseFloat(values.fabric_weight) : 0;
        wasteTextileModel.money =  values.fabric_price ? parseFloat(values.fabric_price) :  0;
        data.wasteTextileModel = wasteTextileModel;
        sumWeight += wasteTextileModel.weight;
        sumMoney += wasteTextileModel.money;
      }
      if (values.glass_weight || values.glass_price) {
        const wasteGlassModel = {};
        wasteGlassModel.weight = values.glass_weight ? parseFloat(values.glass_weight) : 0;
        wasteGlassModel.money =  values.glass_price ? parseFloat(values.glass_price) :  0;
        data.wasteGlassModel = wasteGlassModel;
        sumWeight += wasteGlassModel.weight;
        sumMoney += wasteGlassModel.money;
      }
      if (values.home_appliances_weight || values.home_appliances_price) {
        const wasteApplianceModel = {};
        wasteApplianceModel.weight = values.home_appliances_weight ? parseFloat(values.home_appliances_weight) : 0;
        wasteApplianceModel.money =  values.home_appliances_price ? parseFloat(values.home_appliances_price) :  0;
        data.wasteApplianceModel = wasteApplianceModel;
        sumWeight += wasteApplianceModel.weight;
        sumMoney += wasteApplianceModel.money;
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
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="废金属价格"
                name="metal_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
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
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="废塑料价格"
                name="plastic_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
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
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="废纸张价格"
                name="paper_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
          </Row>


          <Row>
            <Col span={12}>
              <Form.Item
                label="废织物重量"
                name="fabric_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="废织物价格"
                name="fabric_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
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
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="废玻璃价格"
                name="glass_price"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item></Col>
          </Row>

          <Row>
            <Col span={12}>

              <Form.Item
                label="废家电重量"
                name="home_appliances_weight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="废家电价格"
                name="home_appliances_price"
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
            dataIndex: 'wasteMetalModel',
            key: 'wasteMetalModel.weight',
            render: wasteMetalModel => <div>{wasteMetalModel ? wasteMetalModel.weight : 0}</div>
          },
          {
            title: '金额',
            dataIndex: 'wasteMetalModel',
            key: 'wasteMetalModel.money',
            render: wasteMetalModel => <div>{wasteMetalModel ? wasteMetalModel.money : 0}</div>
          },
        ],
      },
      {
        title: '废塑料',
        children: [
          {
            title: '重量',
            dataIndex: 'wastePlasticModel',
            key: 'wastePlasticModel.weight',
            render: wastePlasticModel => <div>{wastePlasticModel ? wastePlasticModel.weight : 0}</div>
          },
          {
            title: '金额',
            dataIndex: 'wastePlasticModel',
            key: 'wastePlasticModel.money',
            render: wastePlasticModel => <div>{wastePlasticModel ? wastePlasticModel.money : 0}</div>
          },
        ],
      },
      {
        title: '废纸张',
        children: [
          {
            title: '重量',
            dataIndex: 'wastePaperModel',
            key: 'wastePaperModel.weight',
            render: wastePaperModel => <div>{wastePaperModel ? wastePaperModel.weight : 0}</div>
          },
          {
            title: '金额',
            dataIndex: 'wastePaperModel',
            key: 'wastePaperModel.money',
            render: wastePaperModel => <div>{wastePaperModel ? wastePaperModel.money : 0}</div>
          },
        ],
      },
      {
        title: '废织物',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteTextileModel',
            key: 'wasteTextileModel.weight',
            render: wasteTextileModel => <div>{wasteTextileModel ? wasteTextileModel.weight : 0}</div>
          },
          {
            title: '金额',
            dataIndex: 'wasteTextileModel',
            key: 'wasteTextileModel.money',
            render: wasteTextileModel => <div>{wasteTextileModel ? wasteTextileModel.money : 0}</div>
          },
        ],
      },
      {
        title: '废玻璃',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteGlassModel',
            key: 'wasteGlassModel.weight',
            render: wasteGlassModel => <div>{wasteGlassModel ? wasteGlassModel.weight : 0}</div>
          },
          {
            title: '金额',
            dataIndex: 'wasteGlassModel',
            key: 'wasteGlassModel.money',
            render: wasteGlassModel => <div>{wasteGlassModel ? wasteGlassModel.money : 0}</div>
          },
        ],
      },
      {
        title: '废家电',
        children: [
          {
            title: '重量',
            dataIndex: 'wasteApplianceModel',
            key: 'wasteApplianceModel.weight',
            render: wasteApplianceModel => <div>{wasteApplianceModel ? wasteApplianceModel.weight : 0}</div>
          },
          {
            title: '金额',
            dataIndex: 'wasteApplianceModel',
            key: 'wasteApplianceModel.money',
            render: wasteApplianceModel => <div>{wasteApplianceModel ? wasteApplianceModel.money : 0}</div>
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
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigthMetal}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoneyMetal}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigthPlastic}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoneyPlastic}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigthPaper}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoneyPaper}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigthTextile}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoneyTextile}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigthGlass}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoneyGlass}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumWeigthappliance}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text>{data.sumMoneyappliance}</Typography.Text>
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

export default Recycle;
