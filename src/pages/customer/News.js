import React from 'react';
import '../../style/pages/customer/News.scss'; // Đảm bảo rằng bạn đã tạo tệp CSS tương ứng
import 'bootstrap/dist/css/bootstrap.min.css';
const News = () => {
    return (
        <div className="News-container">
            <div className="news-box-title">
                <h5 className="news-title">Tin Tức</h5>
            </div>


            <div className="data-bottom row">
                <div className="col-md-6 col-sm-12 data-bottom-box">
                    <div className="data-bottom-item row">
                        <div className="col-md-3 data-bottom-box-item">
                            <img
                                className="data-bottom-box-image"
                                src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731586833/juno_85189bb81cb446a4870bdcc429101b90_1024x1024_i9ztwn.webp"
                                alt="Giao Hàng Miễn Phí"
                            />
                        </div>
                        <div className="col-md-6 data-bottom-box-item">
                            <h5 className="data-bottom-box-title">CÙNG JUNO “GIỮ THỨ HẠNG THÀNH VIÊN” ĐỂ YÊN TÂM MUA SẮM</h5>
                            <p className="data-bottom-box-content">Năm 2023 sắp qua đi, JUNO cảm ơn các khách hàng đã luôn tin tưởng, đồng hành trong suốt chặng đường vừa qua. Theo chính sách Khách hàng thân thiết, trong năm nay JUNO sẽ chính thức áp dụng việc xét hạng theo mức chi tiêu của khách hàng. </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 data-bottom-box">
                    <div className="data-bottom-item row">
                        <div className="col-md-3 data-bottom-box-item">
                            <img
                                className="data-bottom-box-image"
                                src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1731586985/vat-zalo_ca3d0a14526749d1a15884ceb5029009_1024x1024_zkfk8j.webp"
                                alt="Giao Hàng Miễn Phí"
                            />
                        </div>
                        <div className="col-md-6 data-bottom-box-item">
                            <h5 className="data-bottom-box-title">THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%</h5>
                            <p className="data-bottom-box-content">Quý khách hàng thân mến,
                                Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”) còn 8% từ ngày 01/02/2022. Do đó, khi mua sắm tại JUNO, quý khách sẽ được áp dụng mức thuế GTGT mới còn 8% trên tất cả các giao dịch theo quy định mới.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default News;