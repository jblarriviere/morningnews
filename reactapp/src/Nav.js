import React from 'react';
import { connect } from 'react-redux';

import { Link, Redirect } from 'react-router-dom';
import './App.css';
import { Menu, Badge } from 'antd'
import { HomeOutlined, ReadOutlined, LogoutOutlined } from '@ant-design/icons';

function Nav(props) {

  if (props.authToken === '') {
    return (<Redirect to='/' />);
  }

  return (
    <nav >
      <Menu style={{ textAlign: 'center', justifyContent: 'center' }} mode="horizontal" theme="dark">

        <Menu.Item key="mail" icon={<HomeOutlined />}>
          <Link to="/screensource" >
            Sources
          </Link>
        </Menu.Item>

        <Menu.Item key="test" icon={<ReadOutlined />}>
          <Link to="/screenmyarticles">
            My Articles
            <Badge size="small" count={props.wishList.filter(elem => !elem.read).length} offset={[0, -15]} style={{ backgroundColor: '#52c41a' }}>
            </Badge>
          </Link>
        </Menu.Item>

        <Menu.Item key="app" icon={<LogoutOutlined />}>
          <Link to="/" onClick={props.logoutUser}>
            Logout
          </Link>
        </Menu.Item>

      </Menu>
    </nav >
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: function () {
      dispatch({ type: 'logout' })
    }
  }
}

function mapStateToProps(state) {
  return {
    wishList: state.wishList,
    authToken: state.authToken
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Nav);
