const getTotalPrice = ({ items, initial, coupon }) => {
	const price = items.reduce(
		(acc, i) => acc + parseFloat(i.salePrice || i.variation.price),
		0
	);
	return addCoupon({ price, coupon }) + initial;
};

const addCoupon = ({ price, coupon }) => {
	if (!coupon) return price;
	const value = coupon.discount;

	switch (coupon.type) {
		case "Percentage":
			price -= (price / 100) * value;
			break;
		case "Value":
			price -= value;
			break;
		default:
			break;
	}
	if (price < 0) {
		price = 0;
	}
	return price;
};

const itemsToOrder = items => {
	const itemsView = {};

	for (const item of items) {
		const key = item.variation.sku;
		const viewItem = itemsView[key];
		itemsView[key] = !!viewItem
			? { ...viewItem, quantity: viewItem.quantity + 1 }
			: { ...item, quantity: 1 };
	}

	return Object.values(itemsView);
};

export { getTotalPrice, itemsToOrder };
