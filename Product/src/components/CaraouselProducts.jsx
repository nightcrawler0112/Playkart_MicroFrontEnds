import React from "react";
import ProductCard from "./ProductCard";

const CaraouselProducts = ({ products = [] }) => {
  const sortedProducts = [...products].sort((a, b) => {
    if (b.averageRating === a.averageRating) {
      return b.reviewCount - a.reviewCount;
    }
    return b.averageRating - a.averageRating;
  });

  return (
    <div className="d-flex flex-row p-2 gap-3 overflow-auto">
      {sortedProducts.slice(0, 5).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CaraouselProducts;
