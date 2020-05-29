import React, {Component} from 'react';
import {Button, Table, DatePicker, Modal, Form, Input, InputNumber, message, Row, Col} from "antd";
import axios from 'axios';
import moment from 'moment'
import style from './view.less';

const labelCol = {
  span: 12
};
const wrapperCol = {
  span: 12
};
const formRef = React.createRef();
class Transfer extends Component {
  constructor() {
    super();
    this.state = {
      type: 3,
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
    if (formRef.current) {
      formRef.current.resetFields();
    }
    this.setState({isAdd: false, showModal: true, selectedId: id}, () => {
      axios.get(`/front/api/v1/recycle/detail?id=${id}`).then(res => {
        const data = res.data.data;
        const value = {
         address: data.address,
         date: moment(data.date),
        };
        data.wasteList.map((v) => {
          if (v.code === 'metal') {
            value.metal_inWeight = v.inWeight;
            value.metal_inCars = v.inCars;
            value.metal_inPrice = v.inPrice;
            value.metal_outWeight = v.outWeight;
            value.metal_outCars = v.outCars;
            value.metal_outPrice = v.outPrice;
            value.metal_memo = v.memo;
          }
          if (v.code === 'plastic') {
            value.plastic_inWeight = v.inWeight;
            value.plastic_inCars = v.inCars;
            value.plastic_inPrice = v.inPrice;
            value.plastic_outWeight = v.outWeight;
            value.plastic_outCars = v.outCars;
            value.plastic_outPrice = v.outPrice;
            value.plastic_memo = v.memo;
          }
          if (v.code === 'paper') {
            value.paper_inWeight = v.inWeight;
            value.paper_inCars = v.inCars;
            value.paper_inPrice = v.inPrice;
            value.paper_outWeight = v.outWeight;
            value.paper_outCars = v.outCars;
            value.paper_outPrice = v.outPrice;
            value.paper_memo = v.memo;
          }
          if (v.code === 'textile') {
            value.textile_inWeight = v.inWeight;
            value.textile_inCars = v.inCars;
            value.textile_inPrice = v.inPrice;
            value.textile_outWeight = v.outWeight;
            value.textile_outCars = v.outCars;
            value.textile_outPrice = v.outPrice;
            value.textile_memo = v.memo;
          }
          if (v.code === 'glass') {
            value.glass_inWeight = v.inWeight;
            value.glass_inCars = v.inCars;
            value.glass_inPrice = v.inPrice;
            value.glass_outWeight = v.outWeight;
            value.glass_outCars = v.outCars;
            value.glass_outPrice = v.outPrice;
            value.glass_memo = v.memo;
          }
          if (v.code === 'appliance') {
            value.appliance_inWeight = v.inWeight;
            value.appliance_inCars = v.inCars;
            value.appliance_inPrice = v.inPrice;
            value.appliance_outWeight = v.outWeight;
            value.appliance_outCars = v.outCars;
            value.appliance_outPrice = v.outPrice;
            value.appliance_memo = v.memo;
          }
          if (v.code === 'others') {
            value.others_inWeight = v.inWeight;
            value.others_inCars = v.inCars;
            value.others_inPrice = v.inPrice;
            value.others_outWeight = v.outWeight;
            value.others_outCars = v.outCars;
            value.others_outPrice = v.outPrice;
            value.others_memo = v.memo;
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
        wasteList: [],
      };
      if (values.metal_inWeight || values.metal_inCars || values.metal_inPrice || values.metal_outWeight || values.metal_outCars || values.metal_outPrice || values.metal_memo) {
        const model = {
          code: 'metal',
          inWeight: values.metal_inWeight,
          inCars: values.metal_inCars,
          inPrice: values.metal_inPrice,
          outWeight: values.metal_outWeight,
          outCars: values.metal_outCars,
          outPrice: values.metal_outPrice,
          memo: values.metal_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }
      if (values.plastic_inWeight || values.plastic_inCars || values.plastic_inPrice || values.plastic_outWeight || values.plastic_outCars || values.plastic_outPrice || values.plastic_memo) {
        const model = {
          code: 'plastic',
          inWeight: values.plastic_inWeight,
          inCars: values.plastic_inCars,
          inPrice: values.plastic_inPrice,
          outWeight: values.plastic_outWeight,
          outCars: values.plastic_outCars,
          outPrice: values.plastic_outPrice,
          memo: values.plastic_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }
      if (values.paper_inWeight || values.paper_inCars || values.paper_inPrice || values.paper_outWeight || values.paper_outCars || values.paper_outPrice || values.paper_memo) {
        const model = {
          code: 'paper',
          inWeight: values.paper_inWeight,
          inCars: values.paper_inCars,
          inPrice: values.paper_inPrice,
          outWeight: values.paper_outWeight,
          outCars: values.paper_outCars,
          outPrice: values.paper_outPrice,
          memo: values.paper_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }
      if (values.textile_inWeight || values.textile_inCars || values.textile_inPrice || values.textile_outWeight || values.textile_outCars || values.textile_outPrice || values.textile_memo) {
        const model = {
          code: 'textile',
          inWeight: values.textile_inWeight,
          inCars: values.textile_inCars,
          inPrice: values.textile_inPrice,
          outWeight: values.textile_outWeight,
          outCars: values.textile_outCars,
          outPrice: values.textile_outPrice,
          memo: values.textile_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }
      if (values.glass_inWeight || values.glass_inCars || values.glass_inPrice || values.glass_outWeight || values.glass_outCars || values.glass_outPrice || values.glass_memo) {
        const model = {
          code: 'glass',
          inWeight: values.glass_inWeight,
          inCars: values.glass_inCars,
          inPrice: values.glass_inPrice,
          outWeight: values.glass_outWeight,
          outCars: values.glass_outCars,
          outPrice: values.glass_outPrice,
          memo: values.glass_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }
      if (values.appliance_inWeight || values.appliance_inCars || values.appliance_inPrice || values.appliance_outWeight || values.appliance_outCars || values.appliance_outPrice || values.appliance_memo) {
        const model = {
          code: 'appliance',
          inWeight: values.appliance_inWeight,
          inCars: values.appliance_inCars,
          inPrice: values.appliance_inPrice,
          outWeight: values.appliance_outWeight,
          outCars: values.appliance_outCars,
          outPrice: values.appliance_outPrice,
          memo: values.appliance_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }
      if (values.others_inWeight || values.others_inCars || values.others_inPrice || values.others_outWeight || values.others_outCars || values.others_outPrice || values.others_memo) {
        const model = {
          code: 'others',
          inWeight: values.others_inWeight,
          inCars: values.others_inCars,
          inPrice: values.others_inPrice,
          outWeight: values.others_outWeight,
          outCars: values.others_outCars,
          outPrice: values.others_outPrice,
          memo: values.others_memo,
        };
        if (model.inCars || model.outCars) {
          model.sumCars = model.inCars + model.outCars;
        }
        data.wasteList.push(model);
      }

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
        width={1500}
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
                labelCol={{span: 3}}
                wrapperCol={{span: 10}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="日期"
                name="date"
                rules={[{required: true, message: '请选择日期'}]}
                labelCol={{span: 3}}
                wrapperCol={{span: 10}}
              >
                <DatePicker/>
              </Form.Item>
            </Col>
          </Row>

          <h2>废金属：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="metal_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="metal_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="metal_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="metal_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="metal_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="metal_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="metal_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>
          </Row>

          <h2>废塑料：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="plastic_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="plastic_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="plastic_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="plastic_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="plastic_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="plastic_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="plastic_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>
          </Row>


          <h2>废纸张：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="paper_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="paper_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="paper_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="paper_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="paper_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="paper_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="paper_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>
          </Row>

          <h2>废织物：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="textile_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="textile_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="textile_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="textile_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="textile_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="textile_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="textile_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>
          </Row>

          <h2>废玻璃：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="glass_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="glass_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="glass_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="glass_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="glass_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="glass_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="glass_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>
          </Row>

          <h2>废家电：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="appliance_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="appliance_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="appliance_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="appliance_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="appliance_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="appliance_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="appliance_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
              >
                <Input className={style.formItem} allowClear/>
              </Form.Item>
            </Col>
          </Row>

          <h2>其它：</h2>
          <Row>
            <Col span={3}>
              <Form.Item
                label="进场重量"
                name="others_inWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="others_inPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="others_inCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="出货重量"
                name="others_outWeight"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="单价"
                name="others_outPrice"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={2}/>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item
                label="车数"
                name="others_outCars"
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <InputNumber min={0} style={{width: '100%'}} precision={0}/>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="备注"
                name="others_memo"
                rules={[{max: 10, message: '最多输入10个字'}]}
                labelCol={{span: 7}}
                wrapperCol={{span: 17}}
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
        title: '废金属',
        children: [
          {
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'metal_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'metal_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'metal_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'metal_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'metal_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'metal_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'metal_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'metal_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'metal') {
                  return <div>{v.memo}</div>
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
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'plastic_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'plastic_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'plastic_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'plastic_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'plastic_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'plastic_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'plastic_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'plastic_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'plastic') {
                  return <div>{v.memo}</div>
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
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'paper_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'paper_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'paper_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'paper_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'paper_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'paper_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'paper_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'paper_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'paper') {
                  return <div>{v.memo}</div>
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
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'textile_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'textile_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'textile_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'textile_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'textile_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'textile_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'textile_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'textile_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'textile') {
                  return <div>{v.memo}</div>
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
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'glass_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'glass_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'glass_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'glass_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'glass_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'glass_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'glass_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'glass_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'glass') {
                  return <div>{v.memo}</div>
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
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'appliance_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'appliance_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'appliance_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'appliance_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'appliance_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'appliance_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'appliance_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'appliance_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'appliance') {
                  return <div>{v.memo}</div>
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
            title: '进场重量',
            dataIndex: 'wasteList',
            key: 'others_inWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.inWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'others_inPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.inPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'others_inCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.inCars}</div>
                }
              })
            )
          },
          {
            title: '出货重量',
            dataIndex: 'wasteList',
            key: 'others_outWeight',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.outWeight}</div>
                }
              })
            )
          },
          {
            title: '单价',
            dataIndex: 'wasteList',
            key: 'others_outPrice',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.outPrice}</div>
                }
              })
            )
          },
          {
            title: '车数',
            dataIndex: 'wasteList',
            key: 'others_outCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.outCars}</div>
                }
              })
            )
          },
          {
            title: '总车数',
            dataIndex: 'wasteList',
            key: 'others_sumCars',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.sumCars}</div>
                }
              })
            )
          },
          {
            title: '备注',
            dataIndex: 'wasteList',
            key: 'others_memo',
            render: wasteList => (
              wasteList.map((v) => {
                if (v.code === 'others') {
                  return <div>{v.memo}</div>
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
    const {pageSize, loading, data, currentPage} = this.state;
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
              <Table.Summary.Cell>{data.sumInWeightMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPriceMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPriceMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsMetal}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsMetal}</Table.Summary.Cell>
              <Table.Summary.Cell/>

              <Table.Summary.Cell>{data.sumInWeightPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPricePlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPricePlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsPlastic}</Table.Summary.Cell>
              <Table.Summary.Cell/>

              <Table.Summary.Cell>{data.sumInWeightPaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPricePaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsPaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightPaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPricePaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsPaper}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsPaper}</Table.Summary.Cell>
              <Table.Summary.Cell/>

              <Table.Summary.Cell>{data.sumInWeightTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPriceTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPriceTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsTextile}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsTextile}</Table.Summary.Cell>
              <Table.Summary.Cell/>

              <Table.Summary.Cell>{data.sumInWeightGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPriceGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPriceGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsGlass}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsGlass}</Table.Summary.Cell>
              <Table.Summary.Cell/>

              <Table.Summary.Cell>{data.sumInWeightappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPriceappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPriceappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsappliance}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsappliance}</Table.Summary.Cell>
              <Table.Summary.Cell/>

              <Table.Summary.Cell>{data.sumInWeightOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInPriceOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumInCarsOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutWeightOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutPriceOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumOutCarsOthers}</Table.Summary.Cell>
              <Table.Summary.Cell>{data.sumSumCarsOthers}</Table.Summary.Cell>
              <Table.Summary.Cell/>
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

export default Transfer;
