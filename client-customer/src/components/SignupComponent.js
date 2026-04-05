import axios from 'axios';
import React, { Component } from 'react';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: ''
    };
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">SIGN-UP</h2>

        {/* Gắn onSubmit vào form thay vì onClick */}
        <form onSubmit={(e) => this.btnSignupClick(e)}>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtUsername}
                    onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Password</td>
                <td>
                  <input
                    type="password"
                    value={this.state.txtPassword}
                    onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Phone</td>
                <td>
                  <input
                    type="tel"
                    value={this.state.txtPhone}
                    onChange={(e) => this.setState({ txtPhone: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Email</td>
                <td>
                  <input
                    type="email"
                    value={this.state.txtEmail}
                    onChange={(e) => this.setState({ txtEmail: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <button type="submit">SIGN-UP</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  // event-handlers
  btnSignupClick(e) {
    e.preventDefault();

    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const account = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };

      this.apiSignup(account);
    } else {
      alert('Please fill all fields');
    }
  }

  // apis
  apiSignup(account) {
    axios
      .post('http://localhost:3001/api/customer/signup', account)
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        alert('Network error or server not running!');
      });
  }
}

export default Signup;