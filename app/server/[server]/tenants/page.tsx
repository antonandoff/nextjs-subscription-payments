export default function Edit({ params }: { params: { server: string } }) {
  return (
    <>
      <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
        Server: {params?.server}
      </h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-white">
        Tenants
      </p>
    </>
  );
}
