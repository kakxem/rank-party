import type { Game } from "@/types";
import { useState } from "react";

export const Debug = ({ game }: { game: Game }) => {
  const [showDebug, setShowDebug] = useState(true);

  return (
    <div className="absolute bottom-0 right-0 border bg-slate-300 dark:bg-black">
      {!showDebug && (
        <button className="bg-red-600 p-3" onClick={() => setShowDebug(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 6l16 0" />
            <path d="M4 12l16 0" />
            <path d="M4 18l16 0" />
          </svg>
        </button>
      )}

      {showDebug && (
        <>
          <button
            className="absolute right-3 top-3 z-10 text-xl"
            onClick={() => setShowDebug(false)}
          >
            X
          </button>

          <div className="relative p-10">
            <p>{JSON.stringify(game, null, 2)}</p>
          </div>
        </>
      )}
    </div>
  );
};
