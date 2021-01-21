export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat().format(price);
}