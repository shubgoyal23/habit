import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="w-full h-screen bg-white/50 text-black backdrop-blur-lg flex flex-col justify-center items-center text-2xl">
      <h1>Oops!</h1>
      <p className="text-sm my-3">Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/" className="text-blue-500 mt-8">Go To Home Page</Link>
    </div>
  );
}