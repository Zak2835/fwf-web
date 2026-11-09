import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-32">
      <div className="container-x text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="display mt-5 text-6xl text-bone md:text-8xl">Off the mat</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/50">
          This page does not exist. Head back to the gym and find your next class.
        </p>
        <Link href="/en" className="btn btn-primary mt-7">
          Back home
        </Link>
      </div>
    </section>
  );
}
