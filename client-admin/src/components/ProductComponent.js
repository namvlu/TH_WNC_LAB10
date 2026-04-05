import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.category?.name}</td>
          <td>
            <img src={"data:image/jpg;base64," + item.image} width="100" height="100" alt="" />
          </td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if (index + 1 === this.state.curPage) {
        return (<span key={index}>| <b>{index + 1}</b> |</span>);
      } else {
        return (
          <span
            key={index}
            className="link"
            onClick={() => this.lnkPageClick(index + 1)}
          >
            | {index + 1} |
          </span>
        );
      }
    });

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">PRODUCT LIST</h2>

          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Creation date</th>
                <th>Category</th>
                <th>Image</th>
              </tr>

              {prods}

              <tr>
                <td colSpan="6">{pagination}</td>
              </tr>
            </tbody>
          </table>

          <ProductDetail
            item={this.state.itemSelected}
            curPage={this.state.curPage}
            updateProducts={this.updateProducts}
          />
        </div>

        <div className="float-clear"></div>
      </div>
    );
  }

  updateProducts = (products, noPages) => {
    this.setState({
      products: products || [],
      noPages: noPages || 0
    });
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('http://localhost:3001/api/admin/products?page=' + page, config)
      .then((res) => {
        const result = res.data;

        this.setState({
          products: result.products || [],
          noPages: result.noPages || 0,
          curPage: result.curPage || 1
        });
      });
  }
}

export default Product;