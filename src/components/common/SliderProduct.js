import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "../../style/components/common/SliderProduct.scss";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import axios from "axios";

const SliderProduct = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/product/products"
        );
        if (Array.isArray(response.data.products)) {
          const formattedProducts = response.data.products.map((product) => ({
            ...product,
            image_url: product.image_url.replace(/"/g, ""),
          }));
          // Lọc các sản phẩm có quantity > 0
          const availableProducts = formattedProducts.filter(
            (product) => product.quantity > 0
          );
          setProducts(availableProducts);
        } else {
          console.error(
            "Products data is not an array:",
            response.data.products
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="slider-container">
      <div className="product-slider-flash-sale">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={20}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          observer={true}
          observeParents={true}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="slider-1"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index} className="product-slider-item">
              <Link
                className="product-slider-image-box"
                to={`/customer/product/slug/${product.slug}`}
              >
                <img
                  className="product-slider-image"
                  src={product.image_url}
                  alt={product.name}
                />
                <span className="product-slider-highlight">FLASH SALE</span>
              </Link>

              <p className="product-slider-title">{product.name}</p>
              <p className="price-product">
                {parseInt(product.price).toLocaleString("vi-VN")}đ
              </p>
              <div className="btn-product-color">
                {product.variations &&
                  product.variations.map((variation, i) => (
                    <button
                      key={i}
                      className={`btn-color${i + 1}`}
                      style={{ backgroundColor: variation.color }}
                    ></button>
                  ))}
              </div>
              <button className="btn-pay-flash-sale">Mua giá FLASH SALE</button>
            </SwiperSlide>
          ))}
        </Swiper>
        <Link className="product-slider-link" to="">
          Xem Tất Cả
        </Link>
      </div>
    </div>
  );
};

export default SliderProduct;
