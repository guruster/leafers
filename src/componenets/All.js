import { useEffect } from "react";
import Ambassadors from './Ambassadors'
import Collection from './Collection'
import Faq from './Faq'
import Footer from './Footer'
import Header from './Header'
import Slider from "./Slider";
import JoinLeafers from './JoinLeafers'
import LogoSlider from './LogoSlider'
import Roadmap from './Roadmap'
import Team from './Team'
import Utility from './Utility'
import Mint from "./Mint";

function importJS(url) {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    document.body.appendChild(script);
}

const urls = [
    // "assets/js/jquery.min.js",
    // "assets/js/jquery.easing.js",
    // "assets/js/bootstrap.min.js",
    // "assets/js/textanimation.js",
    "assets/js/swiper-bundle.min.js",
    "assets/js/swiper.js",
    // "assets/js/switchmode.js",
    // "assets/js/countto.js",
    // "assets/js/plugin.js",
    // "assets/js/shortcodes.js",
    // "assets/js/main.js",
]

function All() {
    useEffect(() => {
        for (let i = 0; i < urls.length; i++)
            importJS(urls[i])
    }, [])

    return (
        <>
            <div className="preload preload-container">
                <div className="preload-logo"></div>
            </div>

            <div id="wrapper" className="wrapper-style">
                <div id="page" className="clearfix">
                    <Header />
                    <Slider />
                    <Mint />
                    <LogoSlider />
                    <JoinLeafers />
                    <Collection />
                    <Utility />
                    <Roadmap />
                    <Team />
                    <Ambassadors />
                    <Faq />
                    <Footer />
                </div>

            </div>

            <a id="scroll-top"></a>
        </>
    );
}

export default All;
