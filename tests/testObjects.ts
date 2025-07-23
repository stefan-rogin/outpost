import { CatalogGroup, CatalogCategory, CatalogConfigCategory } from "@/models/catalog"
import { Resource, ResourceId } from "@/models/resource"
import { Order, OrderItem } from "@/models/order"
import { Project } from "@/models/project"
import { DehydratedProject } from "@/service/project"
import { Bill, BomItem } from "@/models/bom"

export const testConfig: CatalogConfigCategory[] = [
  {
    title: "Storage",
    items: [["OutpostStorageSolid01Sm", "OutpostStorageSolid01Med", "OutpostStorageSolid01Large"], ["OutpostTransferContainer01"]]
  }
]

export const [storageSolidSmall, storageSolidMedium, storageSolidLarge, storageGasLarge, transferContainer, harvesterGasLarge] = [
  {
    id: "OutpostStorageSolid01Sm",
    name: "Storage - Solid",
    blueprint: { Mfg_Tier01_AdaptiveFrame: 3, InorgCommonIron: 6, InorgCommonAluminum: 5 }
  },
  {
    id: "OutpostStorageSolid01Med",
    name: "Storage - Solid - Medium",
    blueprint: { Mfg_Tier01_AdaptiveFrame: 5, InorgCommonIron: 10, InorgCommonAluminum: 8 }
  },
  {
    id: "OutpostStorageSolid01Large",
    name: "Storage - Solid - Large",
    blueprint: { Mfg_Tier01_AdaptiveFrame: 10, InorgCommonIron: 20, InorgCommonAluminum: 16 }
  },
  {
    id: "OutpostStorageGas01Large",
    name: "Storage - Gas - Large",
    blueprint: {
      Mfg_Tier01_AdaptiveFrame: 10,
      InorgCommonCopper: 20,
      InorgUncommonTungsten: 16
    }
  },
  {
    id: "OutpostTransferContainer01",
    name: "Transfer Container",
    blueprint: { InorgCommonIron: 8, InorgUncommonTungsten: 5, OrgExoticLubricant: 4 }
  },
  {
    id: "OutpostHarvesterGas_03_Large",
    name: "Extractor - Gas - Industrial",
    blueprint: {
      Mfg_Tier03_SubstrateMolecularSieve: 2,
      Mfg_Tier01_AdaptiveFrame: 5,
      Mfg_Tier01_ReactiveGauge: 3,
      InorgRareVanadium: 6
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
  InorgCommonCopper: {
    id: "InorgCommonCopper",
    name: "Copper"
  },
  InorgUncommonTungsten: {
    id: "InorgUncommonTungsten",
    name: "Tungsten"
  },
  OrgUncommonMembrane: {
    id: "OrgUncommonMembrane",
    name: "Membrane"
  },
  InorgRareVanadium: {
    id: "InorgRareVanadium",
    name: "Vanadium"
  },
  InorgExoticIonicLiquids_L: {
    id: "InorgExoticIonicLiquids_L",
    name: "Ionic Liquids"
  },
  OrgExoticBiosuppressant: {
    id: "OrgExoticBiosuppressant",
    name: "Biosuppressant"
  },
  OrgExoticSolvent: {
    id: "OrgExoticSolvent",
    name: "Solvent"
  },
  OrgUniqueMemorySubstrate: {
    id: "OrgUniqueMemorySubstrate",
    name: "Memory Substrate"
  },
  Mfg_Tier01_AdaptiveFrame: {
    id: "Mfg_Tier01_AdaptiveFrame",
    name: "Adaptive Frame",
    blueprint: { InorgCommonIron: 1, InorgCommonAluminum: 1 }
  },
  Mfg_Tier01_ReactiveGauge: {
    id: "Mfg_Tier01_ReactiveGauge",
    name: "Reactive Gauge",
    blueprint: {
      InorgCommonAluminum: 2,
      InorgCommonCopper: 1
    }
  },
  Mfg_Tier01_MagPressureTank: {
    id: "Mfg_Tier01_MagPressureTank",
    name: "Mag Pressure Tank",
    blueprint: {
      InorgCommonAluminum: 2,
      InorgCommonNickel: 1
    }
  },
  Mfg_Tier02_SterileNanotubes: {
    id: "Mfg_Tier02_SterileNanotubes",
    name: "Sterile Nanotubes",
    blueprint: {
      Mfg_Tier02_MolecularSieve: 1,
      InorgRareVanadium: 2,
      OrgExoticSolvent: 2
    }
  },
  Mfg_Tier02_MolecularSieve: {
    id: "Mfg_Tier02_MolecularSieve",
    name: "Molecular Sieve",
    blueprint: {
      Mfg_Tier01_MagPressureTank: 1,
      InorgExoticIonicLiquids_L: 2,
      OrgUncommonMembrane: 2
    }
  },
  Mfg_Tier03_SubstrateMolecularSieve: {
    id: "Mfg_Tier03_SubstrateMolecularSieve",
    name: "Substrate Molecular Sieve",
    blueprint: {
      Mfg_Tier02_MolecularSieve: 1,
      Mfg_Tier02_SterileNanotubes: 2,
      OrgUniqueMemorySubstrate: 3,
      OrgExoticBiosuppressant: 2
    }
  },
  OutpostStorageGas01Large: storageGasLarge,
  OutpostStorageSolid01Large: storageSolidLarge,
  OutpostHarvesterGas_03_Large: harvesterGasLarge
}

export const testOrder: Order = new Map<ResourceId, OrderItem>([
  ["OutpostHarvesterGas_03_Large", { item: harvesterGasLarge, quantity: 1 }],
  ["OutpostStorageGas01Large", { item: storageGasLarge, quantity: 2 }]
])

export const testProject: Project = {
  id: "1f8a4b0c-07e1-4dac-8114-b37b2e65f44b",
  name: "Project",
  order: testOrder,
  deconstructed: ["Mfg_Tier03_SubstrateMolecularSieve", "Mfg_Tier02_MolecularSieve", "Mfg_Tier02_SterileNanotubes"],
  lastChanged: new Date("2025-03-02T22:05:32.000Z")
}

export const testBillNoDeconstructItemSet: Bill = new Map<ResourceId, BomItem>([
  ["Mfg_Tier03_SubstrateMolecularSieve", { item: testResources["Mfg_Tier03_SubstrateMolecularSieve"], quantity: 2 }],
  ["Mfg_Tier01_AdaptiveFrame", { item: testResources["Mfg_Tier01_AdaptiveFrame"], quantity: 25 }],
  ["Mfg_Tier01_ReactiveGauge", { item: testResources["Mfg_Tier01_ReactiveGauge"], quantity: 3 }],
  ["InorgRareVanadium", { item: testResources["InorgRareVanadium"], quantity: 6 }],
  ["InorgCommonCopper", { item: testResources["InorgCommonCopper"], quantity: 40 }],
  ["InorgUncommonTungsten", { item: testResources["InorgUncommonTungsten"], quantity: 32 }]
])

export const testBillWithDeconstructItemSet: Bill = new Map<ResourceId, BomItem>([
  ["Mfg_Tier01_MagPressureTank", { item: testResources["Mfg_Tier01_MagPressureTank"], quantity: 6 }],
  ["Mfg_Tier01_AdaptiveFrame", { item: testResources["Mfg_Tier01_AdaptiveFrame"], quantity: 25 }],
  ["Mfg_Tier01_ReactiveGauge", { item: testResources["Mfg_Tier01_ReactiveGauge"], quantity: 3 }],
  ["InorgExoticIonicLiquids_L", { item: testResources["InorgExoticIonicLiquids_L"], quantity: 12 }],
  ["OrgUncommonMembrane", { item: testResources["OrgUncommonMembrane"], quantity: 12 }],
  ["InorgRareVanadium", { item: testResources["InorgRareVanadium"], quantity: 14 }],
  ["OrgExoticSolvent", { item: testResources["OrgExoticSolvent"], quantity: 8 }],
  ["OrgUniqueMemorySubstrate", { item: testResources["OrgUniqueMemorySubstrate"], quantity: 6 }],
  ["OrgExoticBiosuppressant", { item: testResources["OrgExoticBiosuppressant"], quantity: 4 }],
  ["InorgCommonCopper", { item: testResources["InorgCommonCopper"], quantity: 40 }],
  ["InorgUncommonTungsten", { item: testResources["InorgUncommonTungsten"], quantity: 32 }]
])

export const testBillWithDeconstructDeconstructedSet: Bill = new Map<ResourceId, BomItem>([
  ["Mfg_Tier03_SubstrateMolecularSieve", { item: testResources["Mfg_Tier03_SubstrateMolecularSieve"], quantity: 2 }],
  ["Mfg_Tier02_MolecularSieve", { item: testResources["Mfg_Tier02_MolecularSieve"], quantity: 6 }],
  ["Mfg_Tier02_SterileNanotubes", { item: testResources["Mfg_Tier02_SterileNanotubes"], quantity: 4 }]
])

export const testBillWithDeconstructCase2DeconstructedSet: Bill = new Map<ResourceId, BomItem>([
  ["Mfg_Tier03_SubstrateMolecularSieve", { item: testResources["Mfg_Tier03_SubstrateMolecularSieve"], quantity: 2 }],
  ["Mfg_Tier02_MolecularSieve", { item: testResources["Mfg_Tier02_MolecularSieve"], quantity: 2 }]
])

export const serializedTestProject: string =
  '{"id":"1f8a4b0c-07e1-4dac-8114-b37b2e65f44b","name":"Project",' +
  '"order":{"OutpostHarvesterGas_03_Large":1,"OutpostStorageGas01Large":2},' +
  '"deconstructed":["Mfg_Tier03_SubstrateMolecularSieve","Mfg_Tier02_MolecularSieve","Mfg_Tier02_SterileNanotubes"],' +
  '"lastChanged":"2025-03-02T22:05:32.000Z","version":"1.0"}'

export const dehydratedTestProject: DehydratedProject = {
  id: "1f8a4b0c-07e1-4dac-8114-b37b2e65f44b",
  name: "Project",
  order: { OutpostStorageLiquid01Large: 2, OutpostStorageSolid01Large: 3 },
  deconstructed: ["Mfg_Tier01_AdaptiveFrame"],
  lastChanged: "2025-03-02T22:05:32.000Z",
  version: "1.0"
}

export const testCsv: string = `1, Extractor - Gas - Industrial
2, Storage - Gas - Large

6,Mag Pressure Tank
25,Adaptive Frame
3,Reactive Gauge
12,Ionic Liquids
12,Membrane
14,Vanadium
8,Solvent
6,Memory Substrate
4,Biosuppressant
40,Copper
32,Tungsten
`
