// Function to load GeoJSON data from file
async function loadGeoJSON() {
  try {
    const response = await fetch("iceland.geojson");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading GeoJSON:", error);
    // Return sample data as fallback
    return {};
  }
}

// Load the GeoJSON data and initialize the map
let geojsonData;

// Function to calculate the distance along a path to a point
function getProgressAlongPath(path, point) {
  let minDistance = Infinity;
  let progressAtMinDistance = 0;

  const coordinates = path.features[0].geometry.coordinates;

  // Calculate total path length for percentage calculation
  let totalLength = 0;
  for (let i = 1; i < coordinates.length; i++) {
    totalLength += turf.distance(
      turf.point(coordinates[i - 1]),
      turf.point(coordinates[i])
    );
  }

  // Find closest point on path
  let accumulatedLength = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const start = coordinates[i - 1];
    const end = coordinates[i];

    const segmentLength = turf.distance(turf.point(start), turf.point(end));

    const closestPoint = turf.nearestPointOnLine(
      turf.lineString([start, end]),
      point
    );

    if (closestPoint.properties.dist < minDistance) {
      minDistance = closestPoint.properties.dist;
      const segmentProgress = closestPoint.properties.location / segmentLength;
      progressAtMinDistance =
        (accumulatedLength + segmentLength * segmentProgress) / totalLength;
    }

    accumulatedLength += segmentLength;
  }

  return progressAtMinDistance;
}

// Pan the map while keeping the "virtual center" at 70% horizontally
function panToWithVirtualCenter(map, lng, lat) {
  const mapContainer = map.getContainer();
  const containerWidth = mapContainer.offsetWidth;

  // Calculate the horizontal offset (70% - 50% = 20% of container width)
  const horizontalOffset = (0.7 - 0.5) * containerWidth;

  // Pan to the desired coordinates with an offset
  map.easeTo({
    center: [lng, lat], // Target center (longitude, latitude)
    offset: [horizontalOffset, 0], // Offset from actual center
    zoom: 7, // Optional: Zoom level
    duration: 1500, // Optional: Smooth pan duration in milliseconds
    easing: (t) => t * (2 - t), // Ease out quadratic
  });
}

async function initializeMap() {
  // Load GeoJSON data
  geojsonData = await loadGeoJSON();

  // Sample GeoJSON data
  const locations = geojsonData.features.filter(
    (f) => f.geometry.type === "Point"
  );
  const points = {
    type: "FeatureCollection",
    features: locations,
  };
  const routeData = {
    type: "FeatureCollection",
    features: geojsonData.features.filter(
      (f) => f.geometry.type === "LineString"
    ),
  };

  // Initialize map
  const map = new maplibregl.Map({
    container: "map",
    style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    center: [-21.259719, 63.949967],
    zoom: 7,
  });

  // Initialize ScrollMagic
  const controller = new ScrollMagic.Controller();
  const locationElements = document.querySelectorAll(".location-text");

  // Wait for map to load before adding layers
  map.on("load", () => {
    // Add the route source
    map.addSource("route", {
      type: "geojson",
      data: routeData,
      lineMetrics: true,
    });

    map.addSource("points", {
      type: "geojson",
      data: points,
    });

    map.addLayer({
      id: "points",
      type: "circle",
      source: "points",
      paint: {
        "circle-radius": 5,
        "circle-color": "#007cbf",
      },
    });

    // Add dotted line layer
    map.addLayer({
      id: "route-dashed",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#888",
        "line-width": 2,
        "line-dasharray": [2, 2],
      },
    });

    // Add animated solid line layer
    map.addLayer({
      id: "route-solid",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#007cbf",
        "line-width": 3,
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "#007cbf",
          1,
          "#007cbf",
        ],
      },
    });

    const scrollableDiv = document.querySelector("#text-content");

    // Set up ScrollMagic scenes with geographic-based progress
    locations.forEach((location, index) => {
      const locationElement = locationElements.item(index); // Get the corresponding text element

      // Calculate this location's progress along the path
      const locationProgress = getProgressAlongPath(routeData, location);

      // Create ScrollMagic scene
      new ScrollMagic.Scene({
        triggerElement: locationElement,
        triggerHook: 0.8,
        duration: "100%",
      })
        .on("progress", (e) => {
          // Interpolate between previous and current location progress
          const prevProgress =
            index > 0
              ? getProgressAlongPath(routeData, locations[index - 1])
              : 0;

          const currentProgress =
            prevProgress + (locationProgress - prevProgress) * e.progress;

          // Update the line animation
          map.setPaintProperty("route-solid", "line-gradient", [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "#007cbf", // Solid blue from start
            Math.min(currentProgress, 0.99), // Cap at 0.99
            "#007cbf", // Solid blue up to current progress
            Math.min(currentProgress + 0.01, 1), // Cap at 1
            "rgba(0,0,0,0)", // Fade to transparent
          ]);

          // Pan to current location
          if (e.progress > 0.1 && e.progress < 0.9) {
            const currentLocation = locations[index];
            panToWithVirtualCenter(
              map,
              currentLocation.geometry.coordinates[0],
              currentLocation.geometry.coordinates[1]
            );
          }
        })
        .addTo(controller);
    });
  });
}

// Start the initialization process
initializeMap();
