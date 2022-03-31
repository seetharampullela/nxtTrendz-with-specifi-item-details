// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductsItem from '../SimilarProductItem'

import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  inProgress: 'IN PROGRESS',
  failure: 'IN FAILURE',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productItemData: [],
    apiStatus: apiConstants.initial,
    count: 1,
    similarData: [],
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getDataInFormat = data => ({
    id: data.id,
    imageUrl: data.image_url,
    availability: data.availability,
    brand: data.brand,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
    description: data.description,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiConstants.inProgress})

    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchData = await response.json()
      const updatedData = this.getDataInFormat(fetchData)
      const updatedSimilarProductsData = fetchData.similar_products.map(each =>
        this.getDataInFormat(each),
      )
      console.log(updatedSimilarProductsData)
      this.setState({
        productItemData: updatedData,
        apiStatus: apiConstants.success,
        similarData: updatedSimilarProductsData,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  decrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  renderSuccessView = () => {
    const {productItemData, count, similarData} = this.state
    const {
      //   id,
      imageUrl,
      availability,
      brand,
      price,
      rating,
      title,
      totalReviews,
      description,
    } = productItemData

    return (
      <div className="total-container">
        <div className="success-bg-container">
          <div className="image-container">
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div className="right-side-container">
            <h1>{title}</h1>
            <p className="price-value">Rs {price}/-</p>
            <div className="star-rating-value-container">
              <div className="rating-and-star">
                <p className="rating-text">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p className="description-para">{description}</p>
            <p>
              <span className="span-bold">Availability:</span> {availability}
            </p>
            <p>
              <span className="span-bold">Brand:</span> {brand}
            </p>
            <div className="quantity-flex">
              <button
                type="button"
                onClick={this.decrement}
                className="plus-minus-btn"
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="count-value">{count}</p>
              <button
                type="button"
                onClick={this.increment}
                className="plus-minus-btn"
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="heading-similar">Similar Products</h1>
        <ul className="similar-prod-container">
          {similarData.map(each => (
            <SimilarProductsItem similarItem={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="add-to-cart-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderResultView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.renderResultView()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
