import React, {Component} from 'react';
import {Button, Table, DatePicker, Select, Modal, Form, Input, InputNumber, Typography} from "antd";
import style from './Transfer.less';

const labelCol = {
  span: 5
};
const wrapperCol = {
  span: 12
};
const formRef = React.createRef();
class Transfer extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      isAdd: false,
      showModal: false,
      dataSource: [
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
          f_weight: 222,
          f_price: 2222,
        },
        {
          date: '2020-2-1',
          location: '南亭',
          inout: 1,
          weight: 22,
          price: 222,
        },
        {
          date: '2020-31',
          location: '西亭',
          inout: 0,
          weight: 33,
          price: 333,
        },
        {
          date: '2020-1-1',
          location: '北亭',
          inout: 1,
          weight: 44,
          price: 444,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-1-1',
          location: '东亭',
          inout: 0,
          weight: 11,
          price: 111,
        },
      ],
    }
  }

  getViewData = () => {

  }

  clickSearchButton = () => {
    this.getViewData();
  }

  clickAddButton = () => {
    this.setState({isAdd: true, showModal: true});
  }

  clickEditButton = () => {
    this.setState({isAdd: false, showModal: true});
  }

  totalWeightChanged = (e) => {
    debugger
  }

  totalPriceChanged = (e) => {
    debugger
  }

  submit = () => {
    formRef.current.validateFields().then(values => {
      debugger
    }).catch(err => {
      debugger
    })
  }

  reset = () => {
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
        dataIndex: 'location',
      },
      {
        title: '收/出',
        dataIndex: 'inout',
      },
      {
        title: '合计重量',
        dataIndex: 'weight',
      },
      {
        title: '合计金额',
        dataIndex: 'price',
      },
      {
        title: '废金属',
        children: [
          {
            title: '重量',
            dataIndex: 'f_weight',
          },
          {
            title: '金额',
            dataIndex: 'f_price',
          },
        ],
      },
      {
        title: '废塑料',
        children: [
          {
            title: '重量',
            dataIndex: 'f_weight',
          },
          {
            title: '金额',
            dataIndex: 'f_price',
          },
        ],
      },
      {
        title: '废纸张',
        children: [
          {
            title: '重量',
            dataIndex: 'f_weight',
          },
          {
            title: '金额',
            dataIndex: 'f_price',
          },
        ],
      },
      {
        title: '废织物',
        children: [
          {
            title: '重量',
            dataIndex: 'f_weight',
          },
          {
            title: '金额',
            dataIndex: 'f_price',
          },
        ],
      },
      {
        title: '废玻璃',
        children: [
          {
            title: '重量',
            dataIndex: 'f_weight',
          },
          {
            title: '金额',
            dataIndex: 'f_price',
          },
        ],
      },
      {
        title: '废家电',
        children: [
          {
            title: '重量',
            dataIndex: 'f_weight',
          },
          {
            title: '金额',
            dataIndex: 'f_price',
          },
        ],
      },
      {
        dataIndex: 'id',
        render: id => (
          <div>
            <Button type="primary" onClick={this.clickEditButton}>编辑</Button>
            <Button type="danger">删除</Button>
          </div>
        )
      }
    ]
  }

  configureModal = () => {
    const {isAdd, showModal} = this.state;
    return (
      <Modal
        title={`${isAdd ? '新增' : '编辑'}数据`}
        visible={showModal}
        onCancel={() => this.setState({showModal: false})}
        onOk={this.submit.bind(this)}
      >
        <Form ref={formRef}>
          <Form.Item
            label="日期"
            name="date"
            rules={[{required: true, message: '请选择日期'}]}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <DatePicker/>
          </Form.Item>

          <Form.Item
            label="地点"
            name="location"
            rules={[{required: true, message: '请输入地点'}]}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input className={style.formItem} allowClear/>
          </Form.Item>

          <Form.Item
            label="收/出"
            name="inout"
            rules={[{required: true, message: '请选择收出'}]}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Select className={style.formItem} >
              <Select.Option key={0}>收</Select.Option>
              <Select.Option key={1}>出</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="合计重量"
            name="total_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="合计金额"
            name="total_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废金属重量"
            name="metal_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废金属价格"
            name="metal_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废塑料重量"
            name="plastic_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废塑料价格"
            name="plastic_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废纸张重量"
            name="paper_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废纸张价格"
            name="paper_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废织物重量"
            name="fabric_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废织物价格"
            name="fabric_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废玻璃重量"
            name="glass_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废玻璃价格"
            name="glass_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废家电重量"
            name="home_appliances_weight"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>

          <Form.Item
            label="废家电价格"
            name="home_appliances_price"
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <Input allowClear/>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  configureSearchView = () => {
    return (
      <div style={{padding: '10px 0', display: 'flex'}}>
        <div className={style.search_title}>时间：</div>
        <DatePicker />

        <div className={style.search_title}>地点：</div>
        <Input placeholder="请输入地点" style={{width: '100px'}}/>

        <div className={style.search_title}>收/出：</div>
        <Select defaultValue="0">
          <Select.Option key="0">收</Select.Option>
          <Select.Option key="1">出</Select.Option>
        </Select>

        <Button className={style.search_btn} type="primary" onClick={this.clickSearchButton}>查询</Button>
      </div>
    )
  }

  render() {
    const {loading, dataSource, currentPage} = this.state;
    return (
      <div>
        {this.configureModal()}
        {this.configureSearchView()}

        <Button className={style.add_btn} type="primary" onClick={this.clickAddButton}>新增</Button>

        <Table
          style={{float: 'right', width: '80%'}}
          loading={loading}
          dataSource={dataSource}
          columns={this.getColumns()}
          bordered
          // pagination={{pageSize: 10, total: 1000}}
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
                  <Typography.Text>6666</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>6666</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>5555</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>4444</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>333</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>5555</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>4444</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>333</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>5555</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>4444</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>333</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>5555</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>4444</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text>333</Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </div>
    )
  }
}

export default Transfer;
