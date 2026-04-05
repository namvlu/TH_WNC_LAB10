import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [], // luôn là array
      itemSelected: null
    };
  }

  render() {
    const cates = Array.isArray(this.state.categories)
      ? this.state.categories.map((item) => {
          return (
            <tr
              key={item._id}
              className="datatable"
              onClick={() => this.trItemClick(item)}
            >
              <td>{item._id}</td>
              <td>{item.name}</td>
            </tr>
          );
        })
      : null;

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">CATEGORY LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>

        <div className="inline" />

        <CategoryDetail
          item={this.state.itemSelected}
          updateCategories={this.updateCategories}
        />

        <div className="float-clear" />
      </div>
    );
  }

  // update từ component con
  updateCategories = (data) => {
    // xử lý cả 2 trường hợp API trả về
    if (Array.isArray(data)) {
      this.setState({ categories: data });
    } else if (data.categories) {
      this.setState({ categories: data.categories });
    } else {
      this.setState({ categories: [] });
    }
  };

  componentDidMount() {
    this.apiGetCategories();
  }

  // click row
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // call API
  apiGetCategories() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('http://localhost:3001/api/admin/categories', config)
      .then((res) => {
        console.log(res.data); // debug

        const result = res.data;

        // xử lý linh hoạt response
        if (Array.isArray(result)) {
          this.setState({ categories: result });
        } else if (result.categories) {
          this.setState({ categories: result.categories });
        } else {
          this.setState({ categories: [] });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ categories: [] });
      });
  }
}

export default Category;