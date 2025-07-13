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
        "OutpostStorageSolidSmall",
        "OutpostStorageSolidMedium",
        "OutpostStorageSolidLarge"
      ],
      ["OutpostTransferContainer"]
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
    id: "OutpostStorageSolidSmall",
    name: "Solid Storage Small",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 3,
      InorgCommonIron: 6,
      InorgCommonAluminum: 5
    }
  },
  {
    id: "OutpostStorageSolidMedium",
    name: "Solid Storage Medium",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 5,
      InorgCommonIron: 10,
      InorgCommonAluminum: 8
    }
  },
  {
    id: "OutpostStorageSolidLarge",
    name: "Solid Storage Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonIron: 20,
      InorgCommonAluminum: 16
    }
  },
  {
    id: "OutpostStorageLiquidLarge",
    name: "Liquid Storage Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonAluminum: 20,
      InorgCommonNickel: 16
    }
  },
  {
    id: "OutpostTransferContainer",
    name: "Outpost Transfer Container",
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
  OutpostStorageLiquidLarge: storageLiquidLarge,
  OutpostStorageSolidLarge: storageSolidLarge
}

export const testOrder: Order = new Map<ResourceId, OrderItem>([
  ["OutpostStorageLiquidLarge", { item: storageLiquidLarge, quantity: 2 }],
  ["OutpostStorageSolidLarge", { item: storageSolidLarge, quantity: 3 }]
])
