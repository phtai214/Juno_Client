// src/components/common/Footer.js
import React, { useState } from 'react';
import "../../style/components/common/Footer.scss";
import { Link } from 'react-router-dom';
const Footer = () => {
    const [footer, setFooter] = useState(false);
    const handleFooterClick = () => {
        setFooter(prevFooter => !prevFooter);
    };

    return (
        <footer>
            <div className="footer-container">
                <div className='footer-box row'>
                    <div className='footer-box-item col-md-4'>
                        <p className='call-every-day'>GỌI MUA HÀNG ONLINE (08:00 - 21: 00 mỗi ngày)</p>
                        <p className='call-hotline'>1800 1162</p>
                        <p className='call-note'>Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
                        <p className='call-comment'>GÓP Ý & KHIẾU NẠI (08:30 - 20:30)</p>
                        <p className='call-hotline'>1800 1160</p>
                        <p className='call-note'>Tất cả các ngày trong tuần (Trừ tết Âm Lịch)</p>
                    </div>
                    <div className='footer-box-item col-md-4'>
                        <p className="showroom-list">Hệ Thống ShowRoom</p>
                        <img className="showroom-list-img" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729532110/chikh_ce44b1a9f11b4cbda1d4d319967d7932_ggu2gl.jpg" />
                        <Link className="showroom-list-link" to="">Xem địa chỉ hệ thống 55 showroom</Link>
                    </div>
                    <div className='footer-box-item col-md-4'>
                        <p className="our-fanpage">Fanpage của chúng tôi</p>
                        <Link className="our-fanpage-link" to=""><img className="our-fanpage-img" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729532112/462750862_971291508374000_4330426561271959884_n_joakto.jpg" /></Link>
                        <div className="box-our-fanpage-link">
                            <Link className="our-fanpage-link-social" to=""><img className="our-fanpage-img-social" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1728562402/facebook_5968903_djsy4o.png" /></Link>
                            <Link className="our-fanpage-link-social" to=""><img className="our-fanpage-img-social" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729543227/instagram_1384015_ged2he.png" /></Link>
                            <Link className="our-fanpage-link-social" to=""><img className="our-fanpage-img-social" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729543227/social_10124072_ghjep2.png" /></Link>
                            <Link className="our-fanpage-link-social" to=""><img className="our-fanpage-img-social" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729543227/zalo-icon_dg3ceh.png" /></Link>
                            <Link className="our-fanpage-link-social" to=""><img className="our-fanpage-img-social" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729543227/tiktok_3116491_v3b9gh.png" /></Link>
                        </div>
                    </div>
                </div>
                <div className="footer-dropdown">
                    <ul className="two-column-list">
                        <li className="column">

                            <h4 className="column-p-item" onClick={handleFooterClick}>Hỗ Trợ Khách Hàng <img className="drop-down-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729627546/chevron-down_15734824_kinsmu.png" /> </h4>
                            {footer && (
                                <ul className="column-ul-item">
                                    <li className="column-li-item"><Link to="/customer/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
                                    <li className="column-li-item" > <Link to="/customer/thanh-toan-giao-nhan">Thanh toán giao nhận</Link></li>
                                    <li className="column-li-item" > <Link to="/customer/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                                    <li className="column-li-item" ><Link to="/customer/cau-hoi-thuong-gap">Câu hỏi thường gặp</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="column">
                            <h4 className="column-p-item" onClick={handleFooterClick}>Về JUNO <img className="drop-down-image" src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729627546/chevron-down_15734824_kinsmu.png" /> </h4>
                            {footer && (
                                <ul className="column-ul-item">
                                    <li className="column-li-item"> <Link to="/customer/gioi-thieu">Giới thiệu</Link></li>
                                    <li className="column-li-item"><Link to="/customer/lien-he">Liên Hệ</Link></li>
                                    <li className="column-li-item"><Link to="/customer/tin-tuc">Tin tức</Link></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
