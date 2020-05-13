import React, {Component} from 'react';
import {Button, Table} from "antd";

class Huge extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: [
        {
          date: '2020-1-1',
          location: '东亭11111',
          inout: 0,
          weight: 11,
          price: 111,
        },
        {
          date: '2020-2-1',
          location: '南亭2222',
          inout: 1,
          weight: 22,
          price: 222,
        },
        {
          date: '2020-31',
          location: '西亭3333',
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
      <Table
        style={{float: 'right', width: '80%'}}
        loading={loading}
        dataSource={dataSource}
        columns={this.getColumns()}
        // pagination={{pageSize: 10, total: 1000}}
      />
    )
  }
}

export default Huge;
