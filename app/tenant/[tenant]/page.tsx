export default function Page({ params }: { params: { tenant: string } }) {
  // return <div>My Post: {params?.tenant}</div>
  return (
    <section className="mb-32 dark:bg-black bg-white">
    <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-white dark:bg-black shadow dark:border dark:border-white">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:align-center sm:flex sm:flex-col">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Tenant: {params?.tenant}
                  </h1>
                  <p className="mt-2 text-sm text-gray-700 dark:text-white">
                    A list of all the tenants in your account including their
                    name, title, email and role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}