import React, { useState } from 'react';
import { connect } from 'react-redux';

import './App.css';
import { Input, Button, Alert } from 'antd';
import { Redirect } from 'react-router-dom';

function ScreenHome(props) {

  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInErrors, setSignInErrors] = useState('');

  const handleSignUp = async () => {

    let response = await fetch('/users/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${signUpUsername}&email=${signUpEmail}&password=${signUpPassword}`
    });

    let jsonResponse = await response.json();

    if (jsonResponse.result) {
      props.loginUser(jsonResponse.token)
    } else {
      setSignUpError(jsonResponse.errors.map(error => <Alert message={error} type="error" style={{ marginBottom: '10px', width: '250px' }
      } closable showIcon />));
    }
  }

  const handleSignIn = async () => {

    let response = await fetch('/users/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${signInEmail}&password=${signInPassword}`
    });

    let jsonResponse = await response.json();

    if (jsonResponse.result) {
      //STORE TOKEN IN STORE
      props.loginUser(jsonResponse.token)

      //GET WISHLIST AND REGISTER IN STORE
      let data = await fetch(`/wishlist/articles/${jsonResponse.token}`)
      let jsonData = await data.json();
      props.setWishList(jsonData.wishlist)

    } else {
      setSignInErrors(jsonResponse.errors.map((error, i) => <Alert key={i} message={error} type="error" style={{ marginBottom: '10px', width: '250px' }} closable showIcon />));
    }

  }

  if (props.authToken !== '') {
    return (<Redirect to='/screensource' />);
  } else {
    return (
      <div className="Login-page" >

        {/* SIGN-IN */}

        <div className="Sign">

          <Input
            addonBefore="Email"
            className="Login-input"
            placeholder="arthur@lacapsule.com"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
          />

          <Input.Password
            addonBefore="Password"
            className="Login-input"
            placeholder="password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
          />

          {signInErrors}

          <Button style={{ width: '80px' }} type="primary" onClick={handleSignIn}>Sign-in</Button>

        </div>

        {/* SIGN-UP */}

        <div className="Sign">

          <Input
            addonBefore="Username"
            className="Login-input"
            placeholder="Arthur G"
            value={signUpUsername}
            onChange={(e) => setSignUpUsername(e.target.value)}
          />

          <Input
            addonBefore="Email"
            className="Login-input"
            placeholder="arthur@lacapsule.com"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
          />

          <Input.Password
            addonBefore="Password"
            className="Login-input"
            placeholder="password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
          />

          {signUpError}

          <Button style={{ width: '80px' }} type="primary" onClick={handleSignUp}>Sign-up</Button>

        </div>

      </div>
    );
  }


}

function mapDispatchToProps(dispatch) {
  return {
    loginUser: function (token) {
      dispatch({ type: 'login', token })
    },
    setWishList: function (wishlist) {
      dispatch({ type: 'setWishlist', wishlist })
    }
  }
}

function mapStateToProps(state) {
  return { authToken: state.authToken }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreenHome);


