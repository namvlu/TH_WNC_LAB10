import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    if (this.context.token !== '') {
      return <div />;
    }

    return (
      <div className="align-valign-center">
        <h2 className="text-center">ADMIN LOGIN</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtUsername}
                    onChange={(e) =>
                      this.setState({ txtUsername: e.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td>Password</td>
                <td>
                  <input
                    type="password"
                    value={this.state.txtPassword}
                    onChange={(e) =>
                      this.setState({ txtPassword: e.target.value })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  {/* ✅ FIX: thêm type="button" */}
                  <button
                    type="button"
                    onClick={(e) => this.btnLoginClick(e)}
                  >
                    LOGIN
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  // ================= EVENT =================
  btnLoginClick(e) {
    e.preventDefault();

    const { txtUsername, txtPassword } = this.state;

    if (!txtUsername || !txtPassword) {
      alert('Please input username and password');
      return;
    }

    const account = {
      username: txtUsername,
      password: txtPassword
    };

    this.apiLogin(account);
  }

  // ================= API =================
  apiLogin(account) {
    axios
      .post('http://localhost:3000/api/admin/login', account)
      .then((res) => {
        console.log('Response:', res.data); // ✅ debug

        const result = res.data;

        if (result && result.success === true) {
          this.context.setToken(result.token);
          this.context.setUsername(account.username);

          window.location.href = '/admin';
        } else {
          // ✅ hiển thị đúng lỗi backend
          alert(result.message || 'Login failed');
        }
      })
      .catch((err) => {
        console.error('API ERROR:', err); // ✅ debug chi tiết

        if (err.response) {
          // server trả lỗi (400, 500...)
          alert(err.response.data?.message || 'Server error');
        } else if (err.request) {
          // không connect được server
          alert('Cannot connect to server (CORS / server not running)');
        } else {
          alert('Login failed');
        }
      });
  }
}

export default Login;
