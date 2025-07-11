import { CatalogCategory } from "@/models/catalog"

export const catalog: CatalogCategory[] = [
  {
    title: "Extractors",
    items: [
      {
        title: "Solid Extractors",
        options: [
          "OutpostHarvesterSolidSmall",
          "OutpostHarvesterSolidMedium",
          "OutpostHarvesterSolidLarge"
        ]
      },
      {
        title: "Liquid Extractors",
        options: [
          "OutpostHarvesterLiquidSmall",
          "OutpostHarvesterLiquidMedium",
          "OutpostHarvesterLiquidLarge"
        ]
      },
      {
        title: "Gas Extractors",
        options: [
          "OutpostHarvesterGasSmall",
          "OutpostHarvesterGasMedium",
          "OutpostHarvesterGasLarge"
        ]
      },
      {
        title: "Atmosphere Extractors",
        options: [
          "OutpostHarvesterAtmosphereSmall",
          "OutpostHarvesterAtmosphereMedium",
          "OutpostHarvesterAtmosphereLarge"
        ]
      }
    ]
  },
  {
    title: "Storage",
    items: [
      {
        title: "Solid storage",
        options: [
          "OutpostStorageSolidSmall",
          "OutpostStorageSolidMedium",
          "OutpostStorageSolidLarge"
        ]
      },
      {
        title: "Liquid Storage",
        options: [
          "OutpostStorageLiquidSmall",
          "OutpostStorageLiquidMedium",
          "OutpostStorageLiquidLarge"
        ]
      },
      {
        title: "Gas Storage",
        options: [
          "OutpostStorageGasSmall",
          "OutpostStorageGasMedium",
          "OutpostStorageGasLarge"
        ]
      },
      {
        title: "Transfer Container",
        options: ["OutpostTransferContainer"]
      }
    ]
  }
]
