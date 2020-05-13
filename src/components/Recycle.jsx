import React, {Component} from 'react';
import {Button, Table, DatePicker, Select} from "antd";

class Recycle extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: [
        {
          date: '2020-1-1',
          location: '111东亭',
          inout: 0,
          weight: 11,
          price: 111,
          f_weight: 222,
          f_price: 2222,
        },
        {
          date: '2020-2-1',
          location: '222南亭',
          inout: 1,
          weight: 22,
          price: 222,
        },
        {
          date: '2020-31',
          location: '333西亭',
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
      currentPage: 1,
    }
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
            <Button type="primary">编辑</Button>
            <Button type="danger">删除</Button>
          </div>
        )
      }
    ]
  }

  render() {
    const {loading, dataSource, currentPage} = this.state;
    return (
      <div>
        <div style={{padding: '10px 0'}}>
          <DatePicker />
          <Select defaultValue="0">
            <Select.Option key="0">收</Select.Option>
            <Select.Option key="1">出</Select.Option>
          </Select>
          <Button type="primary">新增</Button>
        </div>

        <Table
          style={{float: 'right', width: '80%'}}
          loading={loading}
          dataSource={dataSource}
          columns={this.getColumns()}
          // pagination={{pageSize: 10, total: 1000}}
        />
      </div>
    )
  }
}

export default Recycle;
