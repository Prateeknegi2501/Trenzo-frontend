import Link from "next/link";

function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-7xl font-bold text-gray-900">404</h1>

      <h2 className="mt-4 text-3xl font-semibold text-gray-800">
        Oops! Page Not Found
      </h2>

      <p className="mt-3 max-w-md text-gray-600">
        The page you're looking for doesn't exist or may have been moved.
        Continue shopping by exploring our latest collections.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/shop/home"
          className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
        >
          Go to Home
        </Link>

        <Link
          href="/shop/listing"
          className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
