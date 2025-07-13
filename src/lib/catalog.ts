import { CatalogConfigCategory } from "@/models/catalog"

export const catalogConfig: CatalogConfigCategory[] = [
  {
    title: "Extractors",
    items: [
      [
        "OutpostHarvesterSolidSmall",
        "OutpostHarvesterSolidMedium",
        "OutpostHarvesterSolidLarge"
      ],
      [
        "OutpostHarvesterLiquidSmall",
        "OutpostHarvesterLiquidMedium",
        "OutpostHarvesterLiquidLarge"
      ],
      [
        "OutpostHarvesterGasSmall",
        "OutpostHarvesterGasMedium",
        "OutpostHarvesterGasLarge"
      ],
      [
        "OutpostHarvesterAtmosphereSmall",
        "OutpostHarvesterAtmosphereMedium",
        "OutpostHarvesterAtmosphereLarge"
      ]
    ]
  },
  {
    title: "Storage",
    items: [
      [
        "OutpostStorageSolidSmall",
        "OutpostStorageSolidMedium",
        "OutpostStorageSolidLarge"
      ],
      [
        "OutpostStorageLiquidSmall",
        "OutpostStorageLiquidMedium",
        "OutpostStorageLiquidLarge"
      ],
      [
        "OutpostStorageGasSmall",
        "OutpostStorageGasMedium",
        "OutpostStorageGasLarge"
      ],
      ["OutpostTransferContainer"]
    ]
  }
]
