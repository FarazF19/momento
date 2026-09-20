"use client";

import dynamic from "next/dynamic";
import { SurfaceMap } from "./surface-map";

const PlacementScene = dynamic(() => import("./placement-scene").then((mod) => mod.PlacementScene), {
  ssr: false,
  loading: () => <div className="placement-3d placement-3d-fallback" />,
});

export function SurfaceStage() {
  return (
    <div className="surface-stage-wrap">
      <PlacementScene />
      <SurfaceMap />
    </div>
  );
}
