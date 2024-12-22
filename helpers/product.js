module.exports.priceNewProducts = (Products) => {
    const newProducts = Products.map(item => {
        item.priceNew = item.price - (item.price * item.discountPercentage/100);
        item.priceNew =  item.priceNew.toFixed();
        return item;
    });
    return newProducts;
}

module.exports.priceNewProduct = (Product) => {
    const priceNew = ((Product.price * (100 - Product.discountPercentage)) / 100).toFixed(0);
    return parseInt(priceNew, 10); 
};
