import {
    Link
} from "react-router-dom";

const Footer = () => {
    return (<>
        <footer className="footer">
            <div className="bottom-inner">
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="bottom">
                                <p className="copy-right">LEAFERS
                                    2023 - ALL rights reserved
                                </p>
                                <ul className="social-item">
                                    <li><a href='/privacy'>Privacy Policy</a></li>
                                    <li><a href='/term'>Terms &amp; Conditions</a></li>
                                    <li><a href="#"><i className="fab fa-discord"></i></a></li>
                                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                                    <li><a href="#"><i className="fab fa-facebook"></i></a></li>
                                    <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </>)
}

export default Footer