module.exports.priceNewProducts = (Products) => {
    const newProducts = Products.map(item => {
        item.priceNew = item.price - (item.price * item.discountPercentage/100);
        item.priceNew =  item.priceNew.toFixed();
        return item;
    });
    return newProducts;
}