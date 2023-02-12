
const Header = () => {
    return (
        <>
            <header className="header">
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div id="site-header-inner">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <a href="/" rel="home" className="main-logo">
                                            <img id="logo_header" src="../assets/images/logo.png" alt="Image" />
                                        </a>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <nav id="main-nav" className="main-nav">
                                        <ul id="menu-primary-menu" className="menu">
                                            <li className="menu-item ">
                                                <a href="#about-us">ABOUT</a>
                                                {/* <Link to='about-us' spy={true} smooth={true}>ABOUT</Link> */}
                                                {/* <HashLink to='/#about-us'>ABOUT</HashLink> */}
                                            </li>
                                            <li className="menu-item ">
                                                <a href="#collection">COLLECTION</a>
                                            </li>
                                            <li className="menu-item ">
                                                <a href="#utility">UTILITY</a>
                                            </li>
                                            <li className="menu-item ">
                                                <a href="#team">TEAM</a>
                                            </li>
                                            <li className="menu-item ">
                                                <a href="#ambassador">AMBASSADORS</a>
                                            </li>
                                            <li className="menu-item ">
                                                <a href="#roadmap">ROADMAP</a>
                                            </li>
                                            <li className="menu-item ">
                                                <a href="#faq">FAQ</a>
                                            </li>
                                            <li className="menu-item d-n">
                                                <a href="#">JOIN LEAFERS</a>
                                            </li>

                                        </ul>
                                    </nav>
                                </div>
                                {/* <div className="header-right">

                                    <a href="#" className="tf-button connect" data-toggle="modal" data-target="#popup_bid"> <i
                                        className="icon-fl-wallet"></i><span>JOIN LEAFERS</span></a>

                                </div> */}
                                <div className="mobile-button"><span></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header