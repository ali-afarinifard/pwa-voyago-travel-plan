"use client";

import dynamic from "next/dynamic";
import { MapSkeleton } from "./MapSkeleton";

export const DestinationMapLoader = dynamic(
  () => import("./DestinationMap").then((mod) => mod.DestinationMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  },
);
