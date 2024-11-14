import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../style/pages/customer/Showroom.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
const Showroom = () => {
    const [shops, setShops] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [selectedShopId, setSelectedShopId] = useState(null); // Trạng thái để theo dõi shop đã chọn
    // Lấy danh sách tỉnh
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                if (response.data.error === 0) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    // Lấy danh sách quận khi tỉnh được chọn
    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    if (response.data.error === 0) {
                        setDistricts(response.data.data);
                        setSelectedDistrict('');
                        setDistrictName('');
                    }
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            } else {
                setDistricts([]);
            }
        };

        fetchDistricts();
    }, [selectedProvince]);

    // Cập nhật tên tỉnh và quận khi người dùng chọn
    const handleProvinceChange = (e) => {
        const selectedId = e.target.value;
        setSelectedProvince(selectedId);
        const selectedProvince = provinces.find(province => province.id === selectedId);
        setProvinceName(selectedProvince ? selectedProvince.full_name : '');
    };
    const handleShopImage = (shopId) => {
        setSelectedShopId(prevShopId => (prevShopId === shopId ? null : shopId)); // Toggle giữa trạng thái hiển thị và ẩn
    };
    const handleDistrictChange = (e) => {
        const selectedId = e.target.value;
        setSelectedDistrict(selectedId);
        const selectedDistrict = districts.find(district => district.id === selectedId);
        setDistrictName(selectedDistrict ? selectedDistrict.full_name : '');
    };

    // Lọc cửa hàng theo tỉnh và quận (nếu có)
    const fetchShops = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/v1/shop/shops');
            const filteredShops = response.data.filter(shop => {
                const location = shop.location || '';
                const locationParts = location.split(',');

                const provinceIndex = locationParts.findIndex(part => part.includes('Thành phố') || part.includes('TP') || part.includes('Tỉnh'));
                const districtIndex = locationParts.findIndex(part => part.includes('Quận') || part.includes('Huyện'));

                const province = provinceIndex !== -1 ? locationParts[provinceIndex].trim() : '';
                const district = districtIndex !== -1 ? locationParts[districtIndex].trim() : '';

                const provinceMatch = selectedProvince ? province.includes(provinceName) : true;
                const districtMatch = selectedDistrict ? district.includes(districtName) : true;

                return provinceMatch && districtMatch;
            });

            setShops(filteredShops);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };



    return (
        <div className="showroom-container">
            <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731509611/hinh-to_562e44c0e33d4ea49381fa67fd692832_jmhh4s.jpg" alt="Showroom Banner" className="showroom-banner" />
            <h1 className="showroom-title">TÌM SHOWROOM</h1>
            <p className="showroom-description">JUNO hiện đang có mặt tại 53 showroom trên toàn quốc. Chọn ngay để biết showroom gần bạn nhất!</p>
            <div className="filter-section">
                <select value={selectedProvince} onChange={handleProvinceChange} className="province-select">
                    <option value="">Chọn Tỉnh Thành</option>
                    {provinces.length > 0 ? (
                        provinces.map((province) => (
                            <option key={province.id} value={province.id}>{province.full_name}</option>
                        ))
                    ) : (
                        <option disabled>Không có tỉnh nào</option>
                    )}
                </select>

                <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince} className="district-select">
                    <option value="">Chọn Quận Huyện</option>
                    {districts.length > 0 ? (
                        districts.map((district) => (
                            <option key={district.id} value={district.id}>{district.full_name}</option>
                        ))
                    ) : (
                        <option disabled>Không có quận nào</option>
                    )}
                </select>

                <button onClick={fetchShops} className="filter-button">Lọc Cửa Hàng</button>
            </div>

            <div className="shop-list">
                {shops.length > 0 ? (
                    shops.map((shop) => (
                        <div className="container-shop row" key={shop.id}>
                            <div className="box-item col-md-6 col-sm-6">
                                <p className="shop-item-address">{shop.location}</p>
                                <p className="shop-item-address">Thời gian hoạt động:  9 giờ - 21 giờ 30 (kể cả CN và ngày lễ)</p>
                                <p className="shop-item-address">Điện Thoại: 1800 1160</p>
                                {selectedShopId === shop.id && (
                                    <img className="shop-img" src={shop.img} alt="Showroom Image" />
                                )}
                            </div>
                            <div className="box-item col-md-3 col-sm-3">
                                <a href={shop.url_map}>Xem bản đồ</a>
                                <p className="btn-img" onClick={() => handleShopImage(shop.id)}>Xem showroom</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <li className="no-shop-item">Không có cửa hàng nào phù hợp.</li>
                )}
            </div>
            <div className="experience-section">
                <h2 className="experience-title">TRẢI NGHIỆM MUA SẮM TẠI SHOWROOM</h2>
                <p className="experience-description">Mua sắm trực tiếp tại hệ thống showroom để có những trải nghiệm dịch vụ tốt nhất.</p>
                <div className="row box-showroom">
                    <div className="col-md-4 box-showroom-item">
                        <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731582246/2_6b6ce8a0c8d24afeb7be42cca41c3794_vyu72f.webp" alt="Showroom 1" className="showroom-image" />
                        <h6 className="showroom-item-title">KHÔNG GIAN THỜI TRANG VÀ HIỆN ĐẠI</h6>
                    </div>
                    <div className="col-md-4 box-showroom-item">
                        <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731582245/3_bec2a819c766492b91b3f74aad6fa21a_bn4f7m.webp" alt="Showroom 2" className="showroom-image" />
                        <h6 className="showroom-item-title">MUA SẮM THOẢI MÁI VÀ TIỆN LỢI</h6>
                    </div>
                    <div className="col-md-4 box-showroom-item">
                        <img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731582246/1_824dd49836c74f249d425481266a920f_ko8lrc.webp" alt="Showroom 3" className="showroom-image" />
                        <h6 className="showroom-item-title">ĐÓN TIẾP ÂN CẦN, TƯ VẤN CHUYÊN NGHIỆP</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Showroom;