import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      imgProduct: ''
    };
  }

  render() {
    // ✅ FIX: đảm bảo luôn là array
    const cates = Array.isArray(this.state.categories)
      ? this.state.categories.map((cate) => (
          <option key={cate._id} value={cate._id}>
            {cate.name}
          </option>
        ))
      : [];

    return (
      <div className="float-right">
        <h2 className="text-center">PRODUCT DETAIL</h2>

        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly />
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
                <td>Price</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtPrice}
                    onChange={(e) => this.setState({ txtPrice: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Image</td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.previewImage(e)}
                  />
                </td>
              </tr>

              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={this.state.cmbCategory}
                    onChange={(e) =>
                      this.setState({ cmbCategory: e.target.value })
                    }
                  >
                    <option value="">-- Select Category --</option>
                    {cates}
                  </select>
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <button onClick={(e) => this.btnAddClick(e)}>ADD NEW</button>
                  <button onClick={(e) => this.btnUpdateClick(e)}>UPDATE</button>
                  <button onClick={(e) => this.btnDeleteClick(e)}>DELETE</button>
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  {this.state.imgProduct && (
                    <img
                      src={this.state.imgProduct}
                      width="300"
                      height="300"
                      alt=""
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item != null) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category?._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }

  // ================= EVENT =================

  btnAddClick(e) {
    e.preventDefault();

    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;

    if (!imgProduct) {
      alert('Please choose image');
      return;
    }

    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (txtName && txtPrice && cmbCategory) {
      const prod = {
        name: txtName,
        price: parseInt(txtPrice),
        category: cmbCategory,
        image: image
      };

      this.apiPostProduct(prod);
    } else {
      alert('Please input full information');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();

    const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;

    if (!txtID) {
      alert('Please select product');
      return;
    }

    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    const prod = {
      name: txtName,
      price: parseInt(txtPrice),
      category: cmbCategory,
      image: image
    };

    this.apiPutProduct(txtID, prod);
  }

  btnDeleteClick(e) {
    e.preventDefault();

    if (window.confirm('ARE YOU SURE?')) {
      if (this.state.txtID) {
        this.apiDeleteProduct(this.state.txtID);
      } else {
        alert('Please select product');
      }
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // ================= API =================

  apiGetCategories() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('http://localhost:3001/api/admin/categories', config)
      .then((res) => {
        // ✅ FIX QUAN TRỌNG
        const result = res.data;
        this.setState({
          categories: Array.isArray(result) ? result : result.categories || []
        });
      });
  }

  apiPostProduct(prod) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.post('http://localhost:3001/api/admin/products', prod, config)
      .then((res) => {
        if (res.data) {
          alert('OK!');
          this.apiGetProducts();
        }
      });
  }

  apiPutProduct(id, prod) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .put('http://localhost:3001/api/admin/products', { id, ...prod }, config)
      .then((res) => {
        if (res.data) {
          alert('OK!');
          this.apiGetProducts();
        }
      });
  }

  apiDeleteProduct(id) {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios.delete('http://localhost:3001/api/admin/products/' + id, config)
      .then((res) => {
        if (res.data) {
          alert('OK!');
          this.apiGetProducts();
        }
      });
  }

  apiGetProducts() {
    const config = {
      headers: { 'x-access-token': this.context.token }
    };

    axios
      .get('http://localhost:3001/api/admin/products?page=' + this.props.curPage, config)
      .then((res) => {
        const result = res.data;
        this.props.updateProducts(result.products, result.noPages);
      });
  }
}

export default ProductDetail;