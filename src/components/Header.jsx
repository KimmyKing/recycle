import React, {Component} from 'react';
import style from './header.less';

class Header extends Component {
  render() {
    return (
      <div className={style.header}>
        <div className={style.title}>亭林镇再生资源综合利用中心数据平台</div>
      </div>
    );
  }
}

export default Header;
