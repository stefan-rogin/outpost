import { CatalogConfigCategory } from "@/models/catalog"

export const catalogConfig: CatalogConfigCategory[] = [
  {
    title: "Extractors",
    items: [
      [
        "OutpostHarvesterSolid_01",
        "OutpostHarvesterSolid_02_Med",
        "OutpostHarvesterSolid_03_Large"
      ],
      [
        "OutpostHarvesterLiquid_01",
        "OutpostHarvesterLiquid_02_Med",
        "OutpostHarvesterLiquid_03_Large"
      ],
      [
        "OutpostHarvesterGas_01",
        "OutpostHarvesterGas_02_Med",
        "OutpostHarvesterGas_03_Large"
      ],
      [
        "OutpostHarvesterAtmosphere_01",
        "OutpostHarvesterAtmosphere_02_Med",
        "OutpostHarvesterAtmosphere_03_Large"
      ]
    ]
  },
  {
    title: "Storage",
    items: [
      [
        "OutpostStorageSolid01Sm",
        "OutpostStorageSolid01Med",
        "OutpostStorageSolid01Large"
      ],
      [
        "OutpostStorageLiquid01Sm",
        "OutpostStorageLiquid01Med",
        "OutpostStorageLiquid01Large"
      ],
      [
        "OutpostStorageGas01Sm",
        "OutpostStorageGas01Med",
        "OutpostStorageGas01Large"
      ],
      ["OutpostTransferContainer01"]
    ]
  }
]
