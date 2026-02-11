type ThunderstoreVersion = {
  name: string;
  version_number: string;
  description: string;
  downloads: number;
  download_url: string;
  date_created: string;
  dependencies: string[];
};

type ThunderstorePackage = {
  name: string;
  full_name: string;
  owner: string;
  rating_score: number;
  is_deprecated: boolean;
  versions: ThunderstoreVersion[];
};

export type CachedPackage = {
  name: string;
  owner: string;
  fullName: string;
  description: string;
  latestVersion: string;
  downloadUrl: string;
  downloadCount: number;
  dateUpdated: string;
  dependencies: string[];
  isDeprecated: boolean;
};

const API_URL = "https://thunderstore.io/c/valheim/api/v1/package/";

let cachedPackages: CachedPackage[] | null = null;

function mapToCached(pkg: ThunderstorePackage): CachedPackage {
  const latest = pkg.versions[0]!;
  return {
    name: pkg.name,
    owner: pkg.owner,
    fullName: pkg.full_name,
    description: latest.description,
    latestVersion: latest.version_number,
    downloadUrl: latest.download_url,
    downloadCount: latest.downloads,
    dateUpdated: latest.date_created,
    dependencies: latest.dependencies,
    isDeprecated: pkg.is_deprecated,
  };
}

export async function fetchPackages(): Promise<CachedPackage[]> {
  if (cachedPackages) return cachedPackages;

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch packages: ${response.status} ${response.statusText}`);
  }

  const data: ThunderstorePackage[] = await response.json();
  cachedPackages = data.map(mapToCached);
  return cachedPackages;
}

export function searchPackages(query: string): CachedPackage[] {
  if (!cachedPackages) return [];

  const terms = query.toLowerCase().trim().split(/\s+/);
  if (terms.length === 0 || (terms.length === 1 && terms[0] === "")) return [];

  return cachedPackages
    .filter((pkg) => {
      if (pkg.isDeprecated) return false;
      const haystack = `${pkg.name} ${pkg.owner} ${pkg.description}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 100);
}
