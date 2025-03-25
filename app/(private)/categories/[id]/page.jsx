export default async function CategoryDetail({ params }) {
  return (
    <div>
      <h1>Category Detail</h1>
      <p>Category ID: {params.id}</p>
    </div>
  );
}
