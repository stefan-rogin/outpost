import { CatalogCategory } from "@/models/catalog"

export const catalog: CatalogCategory[] = [
  {
    title: "Extractors",
    items: [
      {
        title: "Solid extractors",
        options: ["solid_extractor_normal", "solid_extractor_commercial"]
      },
      {
        title: "Liquid extractors",
        options: ["liquid_extractor_normal", "liquid_extractor_commercial"]
      },
      {
        title: "Platform",
        options: ["platform"]
      }
    ]
  },
  {
    title: "Outpost modules",
    items: [{ title: "Airlock", options: ["airlock"] }]
  }
]
