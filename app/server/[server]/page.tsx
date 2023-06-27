export default function Page({ params }: { params: { server: string } }) {
  // return <div>My Post: {params?.tenant}</div>
  return (
    <>
      <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
        Server: {params?.server}
      </h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-white">
        Server details
      </p>
    </>
  );
}
