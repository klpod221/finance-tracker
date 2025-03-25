export default async function CategoryDetail({ params}) {
  const { id } = await params;

  return (
    <div>
      <h1>Category Detail</h1>
      <p>Category ID: {id}</p>
    </div>
  );
}
