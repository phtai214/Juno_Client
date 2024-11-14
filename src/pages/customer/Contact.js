import React from 'react';
import '../../style/pages/customer/Contact.scss';

const Contact = () => {
    return (
        <div className="layout-pageContact">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 col-sm-12 box-heading-contact">
                        <div className="box-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9535674349904!2d106.71301411533402!3d10.7380621628357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f222dc4cac3%3A0xed02c790aba9167a!2zSlVONTYBOF5uZyBUaOG7iyBUaOG6rXA!5e0!3m2!1svi!2s!4v1555663624868!5m2!1svi!2s"
                                width="100%"
                                height="700"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12 wrapbox-content-page-contact">
                        <div className="header-page-contact clearfix">
                            <h1>Liên hệ</h1>
                        </div>
                        <div className="box-info-contact">
                            <ul className="list-info">
                                <li>
                                    <p>Địa chỉ chúng tôi:</p>
                                    <p><strong>313 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, Tp. Hồ Chí Minh.</strong></p>
                                </li>
                                <li>
                                    <p>Email chúng tôi:</p>
                                    <p><strong>cskh@juno.vn</strong></p>
                                </li>
                                <li>
                                    <p>Điện thoại:</p>
                                    <p><strong>1800 1160</strong></p>
                                </li>
                                <li>
                                    <p>Thời gian làm việc:</p>
                                    <p><strong>Thứ 2 đến Thứ 6 từ 8h30 đến 17h30</strong></p>
                                </li>
                            </ul>
                        </div>
                        <div className="box-send-contact">
                            <h2>Gửi thắc mắc cho chúng tôi</h2>
                            <form
                                action="/contact"
                                method="post"
                                className="contact-form"
                                acceptCharset="UTF-8"
                            >
                                <input name="form_type" type="hidden" value="contact" />
                                <input name="utf8" type="hidden" value="✓" />

                                <div className="contact-form">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="input-group">
                                                <input
                                                    required
                                                    type="text"
                                                    name="contact[name]"
                                                    className="form-control"
                                                    placeholder="Tên của bạn"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="input-group">
                                                <input
                                                    required
                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                                    type="email"
                                                    name="contact[email]"
                                                    className="form-control"
                                                    placeholder="Email của bạn"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="input-group">
                                                <input
                                                    pattern="[0-9]{10,12}"
                                                    maxLength={12}
                                                    minLength={10}
                                                    required
                                                    type="tel"
                                                    name="contact[phone]"
                                                    className="form-control"
                                                    placeholder="Số điện thoại của bạn"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="input-group">
                                                <textarea
                                                    name="contact[body]"
                                                    placeholder="Nội dung"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <button className="button dark" type="submit">Gửi cho chúng tôi</button>
                                        </div>
                                    </div>
                                </div>

                                <input
                                    id="g-recaptcha-response"
                                    name="g-recaptcha-response"
                                    type="hidden"
                                />
                                <script src="https://www.google.com/recaptcha/api.js?render=6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-"></script>
                                <script>
                                    {`grecaptcha.ready(function() {
                                        grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
                                            document.getElementById('g-recaptcha-response').value = token;
                                        });
                                    });`}
                                </script>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;