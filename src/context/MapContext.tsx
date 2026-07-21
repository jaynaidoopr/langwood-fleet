import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

interface MapContextValue {
  /** Currently selected vehicle ID (shared across all map-aware pages) */
  selectedVehicleId: number | null;
  setSelectedVehicleId: (id: number | null) => void;
  /** When true and a vehicle is selected, the map shows only that vehicle. */
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
  /** Ref to the global FleetMapLibre handle for calling fitAllVehicles etc. */
  mapHandleRef: React.MutableRefObject<{
    fitAllVehicles: () => void;
    clearMeasurement: () => void;
    flyToVehicle: (lat: number, lng: number, zoom?: number) => void;
    _measureTotalKm?: number;
  } | null>;
}

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const mapHandleRef = useRef<{ fitAllVehicles: () => void; clearMeasurement: () => void; flyToVehicle: (lat: number, lng: number, zoom?: number) => void } | null>(null);

  const handleSetSelected = useCallback((id: number | null) => {
    setSelectedVehicleId(id);
  }, []);

  return (
    <MapContext.Provider value={{ selectedVehicleId, setSelectedVehicleId: handleSetSelected, focusMode, setFocusMode, mapHandleRef }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within MapProvider');
  return ctx;
}
