import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "../../style/pages/customer/Home.scss";
import Countdown from "../../components/common/Countdown";
import SliderProduct from "../../components/common/SliderProduct";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { fetchProducts } from '../../redux/slices/productSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
const Home = () => {
    const targetDate = new Date().getTime() + 24 * 60 * 60 * 1000;
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/v1/product/products');
                if (Array.isArray(response.data.products)) {
                    const formattedProducts = response.data.products.map(product => ({
                        ...product,
                        image_url: product.image_url.replace(/"/g, ''),
                    }));
                    // Lọc các sản phẩm có quantity > 0
                    const availableProducts = formattedProducts.filter(product => product.quantity > 0);
                    setProducts(availableProducts);
                } else {
                    console.error('Products data is not an array:', response.data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="home-container">
            <div className="Banner-homePage">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={false}
                    loop={true}
                >
                    <SwiperSlide>
                        <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729532112/462750862_971291508374000_4330426561271959884_n_joakto.jpg" alt="Image 1" style={{ width: '100%', height: 'auto' }} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729629987/461804403_963256905844127_7265258711963620623_n_ylkyxe.jpg" alt="Image 2" style={{ width: '100%', height: 'auto' }} />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="FLASH-SALE">
                <h1 className="FLASH-SALE-title">FLASH SALE</h1>
                <Countdown targetDate={targetDate} />

                <div className="box-banner-small">
                    <img className="banner-small-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729631496/img_7150_aej5mr.jpg" />
                    <img className="banner-small-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729631497/img_7152_xogmhl.png" />
                    <img className="banner-small-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729631496/img_7151_swphdr.jpg" />
                </div>
                <SliderProduct />
                <div className="product-new">
                    <h4 className="product-new-title">HÀNG MỚI VỀ</h4>
                    <p className="product-new-note">Các sản phẩm bắt nhịp quốc tế, nàng thời thượng không nên bỏ lỡ</p>
                    <div className="product-new-box row">
                        {
                            products.map((product, index) => (
                                <div key={index} className="product-new-item col-md-4">
                                    <Link to={`/customer/product/slug/${product.slug}`}>
                                        <img className="product-new-item-image" src={product.image_url} alt={product.name} />
                                    </Link>
                                    <div className="btn-product-color">
                                        {product.variations && product.variations.map((variation, i) => (
                                            <button key={i} className={`btn-color${i + 1}`} style={{ backgroundColor: variation.color }}></button>
                                        ))}
                                    </div>
                                    <p className="name-product">{product.name}</p>
                                    <p className="price-product">{parseInt(product.price).toLocaleString('vi-VN')}đ</p>
                                    <button className="btn-pay-now">Mua Ngay</button>
                                    {product.quantity <= 0 && <span className="out-of-stock-tag">Hết hàng</span>} {/* Thêm thẻ Hết hàng */}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="home-instagram">
                    <h4 className="home-instagram-title">instagram</h4>
                    <div className="instagram-container row">
                        <div className="col-md-3 col-sm-3 instagram-item">
                            <img className="instagram-item-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731587391/instagram1_s0twgb.webp" />
                        </div>
                        <div className="col-md-3 col-sm-3 instagram-item">
                            <img className="instagram-item-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731587391/instagram2_sstxra.jpg" />
                        </div>
                        <div className="col-md-3 col-sm-3 instagram-item">
                            <img className="instagram-item-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731587391/instagram4_y0zi2l.webp" />
                        </div>
                        <div className="col-md-3 col-sm-3 instagram-item">
                            <img className="instagram-item-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731587391/instagram3_kvfdfs.jpg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
