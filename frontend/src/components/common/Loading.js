import React from "react";

export default function Loading() {
  return (
    <div className="mt-5 flex flex-col items-center justify-center py-8 lg:py-12">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h2 className="mt-4 text-gray-700 lg:text-2xl">Loading...</h2>
    </div>
  );
}
