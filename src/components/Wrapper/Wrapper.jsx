import React from "react";

export default function Wrapper({ children }) {
  return (
    <div className="container mx-auto h-screen p-4 flex gap-4">{children}</div>
  );
}
