export async function getServerSideProps() {
  const res = await fetch("http://174.138.66.50/api/data/");
  const data = await res.json();
  return { props: { data } };
}

export default function Home({ data }) {
  return (
      <div>
          <h1>Next.js + Django API</h1>
          <h2>Test prueba 3</h2>
          <p>{data.message}</p>
      </div>
  );
}
