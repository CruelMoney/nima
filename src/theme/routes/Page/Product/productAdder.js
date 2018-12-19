import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/cart";
import ButtonOptions from "../../../components/Options";
import Accordion from "./accordion";
import { FacebookShareButton } from "react-share";
import intersect from "lodash.intersection";
import difference from "lodash.difference";
import { Helmet } from "react-helmet";
import ReactPixel from "react-facebook-pixel";

const getPossibleOptionCombinations = ({ variants }) => {
	return variants
		.filter(v => v.used && v.inventory > 0)
		.map(v => v.combinationIds);
};

class ProductAdder extends Component {
	state = {
		productAdded: false,
		selectedOptions: {}
	};

	onAddBag = () => {
		const { product } = this.props;
		const { selectedOptions, chosenVariation } = this.state;

		if (!chosenVariation) {
			const a1 = Object.keys(product.options);
			const a2 = Object.keys(selectedOptions);
			const dif = difference(a1, a2);

			alert(`Vælg ${dif.join(" og ")} først.`);
		} else {
			this.setState({
				productAdded: true
			});
			this.props.addToCart({
				...this.props.product,
				variation: chosenVariation
			});
			setTimeout(() => {
				this.setState({
					productAdded: false
				});
			}, 1000);
		}
	};

	selectOption = (optionName, optionValue) => {
		this.setState(
			state => ({
				selectedOptions: {
					...state.selectedOptions,
					[optionName]: optionValue
				},
				chosenVariation: null
			}),
			() => {
				const { product } = this.props;
				let { selectedOptions } = this.state;
				const a1 = Object.keys(product.options);
				const a2 = Object.keys(selectedOptions);
				const dif = difference(a1, a2);
				if (dif.length === 0) {
					// set new variation as selected
					selectedOptions = Object.values(selectedOptions);
					const variation = product.variants.find(v => {
						return (
							intersect(v.combinationIds, selectedOptions).length === a1.length
						);
					});
					this.setState({
						chosenVariation: variation
					});
				}
			}
		);
	};

	optionIsPossible = (option, optionCategory) => {
		const { product } = this.props;
		let { selectedOptions } = this.state;
		const possibleVariants = getPossibleOptionCombinations(product);

		// If option already in selectedOptions, override it as this is a new selection
		selectedOptions = {
			...selectedOptions,
			[optionCategory.name]: option.id
		};

		// get only id's
		selectedOptions = Object.values(selectedOptions);

		// Check if there's a complete intersection with the possibleVariants
		const isPossible = possibleVariants.some(
			c => intersect(c, selectedOptions).length === selectedOptions.length
		);

		return isPossible;
	};

	isSoldOut = () => {
		const { product } = this.props;
		return product.variants.every(o => Number(o.inventory) <= 0);
	};

	componentDidMount() {
		const { product } = this.props;
		const { chosenVariation } = this.state;
		const price = !chosenVariation ? product.price : chosenVariation.price;

		ReactPixel.track("ViewContent", {
			//	content_ids: [product.SKU],
			content_name: product.title,
			content_type: "product",
			contents: [
				{
					id: product.SKU,
					quantity: 1,
					item_price: price
				}
			],
			value: price,
			currency: "DKK"
		});
	}

	render() {
		const { product, editMode, publicURL } = this.props;
		const { productAdded, chosenVariation } = this.state;
		const soldOut = this.isSoldOut();
		const url = publicURL + "/" + product.slug;
		const price = !chosenVariation ? product.price : chosenVariation.price;
		const options = Object.values(product.options);
		return (
			<React.Fragment>
				<Helmet>
					<meta property="product:brand" content="Nima" />
					<meta
						property="product:availability"
						content={soldOut ? "out of stock" : "in stock"}
					/>
					<meta property="product:condition" content="new" />
					<meta property="product:price:amount" content={price} />
					<meta property="product:price:currency" content="DKK" />
					<meta property="product:retailer_item_id" content={product.SKU} />
				</Helmet>

				<h1 className="xl:text-6xl text-5xl">{product.title}</h1>
				<p>{product.description}</p>
				<p className="price">
					{product.salePrice ? (
						<strong>
							Pris: <span className="strikeout">{price} DKK</span>{" "}
							<span className="sale-price">{product.salePrice} DKK</span>
						</strong>
					) : (
						<strong>Pris: {price} DKK</strong>
					)}
				</p>
				<ul className="alternate-actions">
					<li>
						<Accordion label={"FORSENDELSE"} />
					</li>
					<li>
						<FacebookShareButton url={url}>DEL</FacebookShareButton>
					</li>
				</ul>
				{!!options &&
					options.map(o => (
						<React.Fragment key={"option-" + o.name}>
							<h4>{o.name}:</h4>
							<ButtonOptions
								editMode={editMode}
								options={o.variants.map(option => {
									const disabled = !this.optionIsPossible(option, o);
									return {
										...option,
										disabled
									};
								})}
								onChange={oVal => this.selectOption(o.name, oVal.id)}
							/>
						</React.Fragment>
					))}

				<button
					onClick={this.onAddBag}
					disabled={productAdded || soldOut}
					className={`add-to-bag bg-transparent font-medium mt-6 active`}
				>
					{soldOut ? "UDSOLGT" : productAdded ? "TILFØJET" : "TILFØJ TIL KURV"}
				</button>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addToCart: product => {
			dispatch(actions.addToCart(product));
		}
	};
};

export default connect(
	state => state,
	mapDispatchToProps
)(ProductAdder);
