import React, {Component} from 'react';
import {connect} from "dva";
import {Menu, ConfigProvider, Button} from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import Header from '../components/Header';
import Organic from "../components/Organic";
import Huge from '../components/Huge';
import Transfer from '../components/Transfer';
import Recycle from '../components/Recycle';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      selectedKey: 'transfer',
      loading: false,
    }
  }

  selectMenu = ({item, key}) => {
    this.setState({selectedKey: key})
  }

  switchPage = () => {
    const {selectedKey} = this.state;
    switch (selectedKey) {
      case 'organic':
        return <Organic/>;
      case 'huge':
        return <Huge/>;
      case 'transfer':
        return <Transfer/>;
      case 'recycle':
        return <Recycle/>
      default:
        return null
    }
  }

  render(){
    // const {home, dispatch} = this.props;
    const {selectedKey} = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <div style={{height: '100%'}}>
          <Header/>
          <Menu
            style={{float: 'left', width: '20%', height: '100%'}}
            mode="inline"
            defaultSelectedKeys={[selectedKey]}
            onSelect={this.selectMenu}
          >
            <Menu.Item key="organic">有机垃圾</Menu.Item>
            <Menu.Item key="huge">大件垃圾</Menu.Item>

            <Menu.SubMenu
              title="两网融合"
            >
              <Menu.Item key="transfer">中转站</Menu.Item>
              <Menu.Item key="recycle">上门回收/预约回收</Menu.Item>
            </Menu.SubMenu>
          </Menu>

          {this.switchPage()}
        </div>
      </ConfigProvider>
    );
  }
}

export default connect((state) => ({
  home: state.home
}))(Home);
