"use client";

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Map3DProps {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  buildingFloors: number;
  flyTrigger: number;
  flyType: "orbit" | "reset";
}

export default function Map3D({
  center,
  zoom,
  pitch,
  bearing,
  buildingFloors,
  flyTrigger,
  flyType,
}: Map3DProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapInstance.current || !mapContainer.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "satellite-tiles": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
            },
            "terrain-dem": {
              type: "raster-dem",
              tiles: [
                "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
              ],
              encoding: "terrarium",
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "satellite-layer",
              type: "raster",
              source: "satellite-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
          terrain: {
            source: "terrain-dem",
            exaggeration: 1.8,
          },
        },
        center: center,
        zoom: zoom,
        pitch: pitch,
        bearing: bearing,
      });

      map.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.on("load", () => {
        // Add 3D Procedural Building Layer
        map.addSource("building-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: { height: buildingFloors * 3.5, base: 0, color: "#38bdf8" },
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [center[0] - 0.001, center[1] - 0.001],
                      [center[0] + 0.001, center[1] - 0.001],
                      [center[0] + 0.001, center[1] + 0.001],
                      [center[0] - 0.001, center[1] + 0.001],
                      [center[0] - 0.001, center[1] - 0.001],
                    ],
                  ],
                },
              },
            ],
          },
        });

        map.addLayer({
          id: "3d-building-layer",
          type: "fill-extrusion",
          source: "building-source",
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "base"],
            "fill-extrusion-opacity": 0.85,
          },
        });
      });

      mapInstance.current = map;
    } catch (err) {
      console.error("Map initialization error:", err);
    }

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update center when location changes
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.flyTo({
      center: center,
      zoom: zoom,
      pitch: pitch,
      essential: true,
      duration: 3000,
    });
  }, [center, zoom, pitch]);

  // Update 3D Building height dynamically
  useEffect(() => {
    if (!mapInstance.current) return;
    const source = mapInstance.current.getSource("building-source") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { height: buildingFloors * 3.5, base: 0, color: "#38bdf8" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [center[0] - 0.001, center[1] - 0.001],
                  [center[0] + 0.001, center[1] - 0.001],
                  [center[0] + 0.001, center[1] + 0.001],
                  [center[0] - 0.001, center[1] + 0.001],
                  [center[0] - 0.001, center[1] - 0.001],
                ],
              ],
            },
          },
        ],
      });
    }
  }, [buildingFloors, center]);

  // Trigger Flythrough Camera
  useEffect(() => {
    if (!mapInstance.current || flyTrigger === 0) return;
    if (flyType === "orbit") {
      mapInstance.current.flyTo({
        center: center,
        zoom: 16.5,
        pitch: 75,
        bearing: 110,
        duration: 4000,
      });
    } else {
      mapInstance.current.flyTo({
        center: center,
        zoom: 14,
        pitch: 65,
        bearing: -20,
        duration: 2500,
      });
    }
  }, [flyTrigger, flyType]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
    />
  );
}