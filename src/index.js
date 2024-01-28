import { asyncScheduler, of, scheduled } from 'rxjs';

const user$ = of({
	name: 'Joe',
	age: 22,
	isPremiumMember: false,
});

const productService = {
	getProducts$(age) {
		if (age < 18) {
			return scheduled(
				of([{ name: 'Child product 1', price: 100 }]),
				asyncScheduler
			);
		} else {
			return scheduled(
				of([{ name: 'Adult product 1', price: 100 }]),
				asyncScheduler
			);
		}
	},
};

function discount(products) {
	return products.map((product) => {
		product.price = product.price * 0.9;
		return product;
	});
}

function applyDiscount(user, products) {
	if (user.isPremiumMember) {
		return discount(products);
	} else {
		return products;
	}
}

function lowercase(products) {
	return products.map((product) => {
		product.name = product.name.toLowerCase();
		return product;
	});
}

user$.subscribe((user) => {
	productService.getProducts$(user.age).subscribe((products) => {
		products = lowercase(products);

		// we are able to access user from closure
		const result = applyDiscount(user, products);
		console.log(result);
	});
});
