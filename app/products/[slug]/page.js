import ProductPage from "@/Components/Products/ProductPage";

export default function Product({ params }) {
  return (
    <>
      <ProductPage productId={params.id} />
    </>
  );
}
