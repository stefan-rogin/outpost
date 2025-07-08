import { Resource, ResourceId } from "@/models/resource"

const blueprint = (inputs: [ResourceId, number][]): Map<ResourceId, number> =>
  new Map(inputs.map(([id, qty]) => [id, qty]))

export const resources = new Map<ResourceId, Resource>([
  ["fe", { id: "fe", name: "Iron" }],
  ["al", { id: "al", name: "Aluminium" }],
  ["cu", { id: "cu", name: "Copper" }],
  [
    "adaptive_frame",
    {
      id: "adaptive_frame",
      name: "Adaptive Frame",
      blueprint: blueprint([
        ["fe", 1],
        ["al", 1]
      ])
    }
  ],
  [
    "solid_extractor_normal",
    {
      id: "solid_extractor_normal",
      name: "Solid Extractor - Normal",
      blueprint: blueprint([
        ["adaptive_frame", 2],
        ["cu", 2]
      ])
    }
  ],
  [
    "solid_extractor_commercial",
    {
      id: "solid_extractor_commercial",
      name: "Solid Extractor - Commercial",
      blueprint: blueprint([
        ["adaptive_frame", 4],
        ["cu", 4]
      ])
    }
  ],
  [
    "liquid_extractor_normal",
    {
      id: "liquid_extractor_normal",
      name: "Liquid Extractor - Normal",
      blueprint: blueprint([
        ["adaptive_frame", 2],
        ["cu", 2]
      ])
    }
  ],
  [
    "liquid_extractor_commercial",
    {
      id: "liquid_extractor_commercial",
      name: "Liquid Extractor - Commercial",
      blueprint: blueprint([
        ["adaptive_frame", 4],
        ["cu", 4]
      ])
    }
  ],
  [
    "platform",
    {
      id: "platform",
      name: "Platform",
      blueprint: blueprint([
        ["adaptive_frame", 1],
        ["fe", 1]
      ])
    }
  ],
  [
    "airlock",
    {
      id: "airlock",
      name: "Airlock",
      blueprint: blueprint([
        ["adaptive_frame", 2],
        ["cu", 1],
        ["fe", 1]
      ])
    }
  ]
])
