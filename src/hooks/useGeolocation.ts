"use client";

import { useState, useEffect } from "react";
import { DEFAULT_CENTER } from "@/types";

interface GeoState {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, error: "Geolocation not supported" }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, loading: false, error: null });
      },
      () => {
        setState((s) => ({ ...s, loading: false, error: "Location unavailable — showing DFW" }));
      },
      { timeout: 5000, maximumAge: 300_000 }
    );
  }, []);

  return state;
}
