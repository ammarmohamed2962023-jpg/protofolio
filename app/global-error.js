'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#060912] p-4 text-center text-white">
          <div className="max-w-md w-full p-8 space-y-4 border border-red-500/20 rounded-2xl bg-[#0d1117]">
            <h1 className="text-2xl font-bold text-red-400">Critical Application Error</h1>
            <p className="text-sm text-gray-400">
              A fatal error occurred at the root level.
            </p>
            <button
              onClick={() => reset()}
              className="w-full py-2.5 rounded-full text-sm font-bold mt-4 bg-white text-black"
            >
              Recover Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
