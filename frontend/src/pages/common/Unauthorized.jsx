import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0f]">
    <div className="text-center">
      <p className="text-7xl font-bold text-slate-200 dark:text-white/10 mb-4">
        403
      </p>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Access denied
      </h1>
      <p className="text-sm text-slate-500 dark:text-white/40 mb-6">
        You don&apos;t have permission to view this page.
      </p>
      <Link
        to="/"
        className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:brightness-110 transition-all duration-200"
      >
        Go to dashboard
      </Link>
    </div>
  </div>
);

export default Unauthorized;
