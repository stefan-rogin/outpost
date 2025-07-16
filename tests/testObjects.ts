import {
  CatalogGroup,
  CatalogCategory,
  CatalogConfigCategory
} from "@/models/catalog"
import { Resource, ResourceId } from "@/models/resource"
import { Order, OrderItem } from "@/models/order"

export const testConfig: CatalogConfigCategory[] = [
  {
    title: "Storage",
    items: [
      [
        "OutpostStorageSolid01Sm",
        "OutpostStorageSolid01Med",
        "OutpostStorageSolid01Large"
      ],
      ["OutpostTransferContainer01"]
    ]
  }
]

export const [
  storageSolidSmall,
  storageSolidMedium,
  storageSolidLarge,
  storageLiquidLarge,
  transferContainer
] = [
  {
    id: "OutpostStorageSolid01Sm",
    name: "Storage - Solid",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 3,
      InorgCommonIron: 6,
      InorgCommonAluminum: 5
    }
  },
  {
    id: "OutpostStorageSolid01Med",
    name: "Storage - Solid - Medium",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 5,
      InorgCommonIron: 10,
      InorgCommonAluminum: 8
    }
  },
  {
    id: "OutpostStorageSolid01Large",
    name: "Storage - Solid - Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonIron: 20,
      InorgCommonAluminum: 16
    }
  },
  {
    id: "OutpostStorageLiquid01Large",
    name: "Storage - Liquid - Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonAluminum: 20,
      InorgCommonNickel: 16
    }
  },
  {
    id: "OutpostTransferContainer01",
    name: "Transfer Container",
    blueprint: {
      InorgCommonIron: 8,
      InorgUncommonTungsten: 5,
      OrgExoticLubricant: 4
    }
  }
]

export const testGroups: CatalogGroup[] = [
  {
    inView: storageSolidSmall,
    options: [storageSolidSmall, storageSolidMedium, storageSolidLarge]
  },
  {
    inView: transferContainer,
    options: [transferContainer]
  }
]

export const testCategory: CatalogCategory = {
  title: "Storage",
  items: testGroups
}

export const testResources: Record<ResourceId, Resource> = {
  InorgCommonAluminum: {
    id: "InorgCommonAluminum",
    name: "Aluminum"
  },
  InorgCommonIron: {
    id: "InorgCommonIron",
    name: "Iron"
  },
  InorgCommonNickel: {
    id: "InorgCommonNickel",
    name: "Nickel"
  },
  Mfg_Tier01_AdaptiveFrame: {
    id: "Mfg_Tier01_AdaptiveFrame",
    name: "Adaptive Frame",
    blueprint: {
      InorgCommonIron: 1,
      InorgCommonAluminum: 1
    }
  },
  OutpostStorageLiquid01Large: storageLiquidLarge,
  OutpostStorageSolid01Large: storageSolidLarge
}

export const testOrder: Order = new Map<ResourceId, OrderItem>([
  ["OutpostStorageLiquid01Large", { item: storageLiquidLarge, quantity: 2 }],
  ["OutpostStorageSolid01Large", { item: storageSolidLarge, quantity: 3 }]
])
