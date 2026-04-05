import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      username: '',
      setToken: this.setToken,
      setUsername: this.setUsername
    };
  }

  // ✅ THÊM ĐOẠN NÀY
  componentDidMount() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token) {
      this.setState({ token: token });
    }
    if (username) {
      this.setState({ username: username });
    }
  }

  setToken = (value) => {
    this.setState({ token: value });
    localStorage.setItem('token', value); // ✅ lưu lại
  };

  setUsername = (value) => {
    this.setState({ username: value });
    localStorage.setItem('username', value); // ✅ lưu lại
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;