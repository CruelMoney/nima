import React, { Component } from "react";
import { fetcher } from "cude-cms";
import Post from "./Post";
import Overview from "./OverviewPage";
import Product from "./Product";
import NotFound from "./NotFound";
import Loading from "../Loading";
import { Helmet } from "react-helmet";
import Lookbook from "./Lookbook";
import { NotificationDecider } from "../../components/Menu/Notification";

class Page extends Component {
	render() {
		const { location, data, publicURL } = this.props;
		const pages = data.results;
		let page = !!pages
			? pages.find(page => "/" + page.slug === location.pathname)
			: false;
		let PageComponent = null;
		let type = "website";

		if (!page) {
			PageComponent = NotFound;
			page = {
				title: "Not Found",
				description: "The page could not be found."
			};
		} else if (page.__t === "Overview") {
			PageComponent = Overview;
		} else if (page.__t === "Product") {
			PageComponent = Product;
			type = "product";
		} else if (page.__t === "Lookbook") {
			PageComponent = Lookbook;
			type = "article";
		} else {
			PageComponent = Post;
			type = "article";
		}

		let title = `${page.title || ""} nimacph.`;

		return (
			<React.Fragment>
				<Helmet>
					<title>{title}</title>
					<meta property="og:title" content={title} />
					<meta property="og:url" content={publicURL + location.pathname} />
					<meta property="og:type" content={type} />
					<meta
						property="description"
						content={
							page.description ||
							"Nimacph er et lille, lokalt økologisk brand startet i København. Brandet blev lanceret i en røgfyldt lejlighed på Vesterbro 2018 af Nikolaj og Mads. To meget blege drenge med en stor kærlighed for verden, mellemøsten og de små ting. Vores produkter blev derfor et mix af skandinavirens enkelthed og arabisk skrift. "
						}
					/>
					<meta
						property="og:description"
						content={
							page.description ||
							"Nimacph er et lille, lokalt økologisk brand startet i København. Brandet blev lanceret i en røgfyldt lejlighed på Vesterbro 2018 af Nikolaj og Mads. To meget blege drenge med en stor kærlighed for verden, mellemøsten og de små ting. Vores produkter blev derfor et mix af skandinavirens enkelthed og arabisk skrift. "
						}
					/>
					{page.thumbnail && page.thumbnail.file ? (
						<meta
							property="og:image"
							content={
								publicURL + "/uploads/files/" + page.thumbnail.file.filename
							}
						/>
					) : null}
				</Helmet>
				<PageComponent publicURL={publicURL} page={page} />
				<NotificationDecider page={page} />
			</React.Fragment>
		);
	}
}

export default fetcher(
	Page,
	"/api/pages",
	true,
	<Loading text={"nimacph."} active />
);
