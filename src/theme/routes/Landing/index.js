import React, { Component } from "react";
import Logo from "../../components/Logo";
import { fetcher } from "cude-cms";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./index.css";

class Landing extends Component {
	state = {
		hover: false,
		videoLoaded: false
	};

	componentDidMount() {}

	onVideoLoaded = () => {
		this.setState({
			videoLoaded: true
		});
	};

	getMetaData = () => {
		const { data, publicURL } = this.props;
		const conf =
			data.results && data.results.find(c => c.__t === "GeneralConfiguration");
		if (!!conf)
			return {
				...conf.siteMeta,
				image: publicURL + conf.siteMeta.image.url
			};
		return {};
	};

	render() {
		const meta = this.getMetaData();
		const { videoLoaded, hover } = this.state;
		return (
			<div
				className={`landingVideo p-8 lg:p-16 ${hover &&
					"hover"} ${videoLoaded && "loaded"}`}
			>
				<Helmet>
					<title>{meta.title}</title>
					<meta property="description" content={meta.description} />
					<meta property="og:description" content={meta.description} />
					<meta property="og:image" content={meta.image} />
				</Helmet>
				<div className={`overflow-hidden w-full h-full grey`}>
					{/* <video 
            autoPlay 
            loop 
            playsInline 
            muted 
            preload="auto"
            onCanPlayThrough={this.onVideoLoaded}
            className={`object-fit-cover w-full h-full`}
            >
            <source src="/uploads/files/landing-video.mp4#t=0.1" type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}

					<img src={meta.image} alt="" />
				</div>
				<div className="absolute pin flex justify-center items-center flex-col">
					<Logo color={"white"} shadow />
					<h1 className="sm:mb-16 mb-0 text-white text-shadow">nimacph.</h1>
					<Link
						to="/shop"
						onMouseEnter={() => this.setState({ hover: true })}
						onMouseLeave={() => this.setState({ hover: false })}
						className={`mb-16 sm:mb-0 landing-button bg-transparent hover:bg-white  text-white font-medium hover:text-black py-4 lg:px-24 px-12 border-2 border-white hover:border-transparent`}
					>
						GÅ TIL WEBSHOP
					</Link>
				</div>
			</div>
		);
	}
}

export default fetcher(Landing, "/api/configuration");
