import {
  getMapRegions,
  getMapStatistics,
} from "../../lib/maps";

import MapasClient from "./MapasClient";

export default async function MapasPage() {
  const regions =
    await getMapRegions();

  const statistics =
    getMapStatistics(regions);

  return (
    <MapasClient
      regions={regions}
      statistics={statistics}
    />
  );
}