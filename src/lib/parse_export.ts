// $ npx tsx ./parse_export.ts

import fs from "node:fs/promises"
import { Resource, ResourceId } from "@/models/resource"

type PatternFilter = {
  include: RegExp[]
  exclude: RegExp[]
}

const CONSTRUCTIBLES_FILE = "../resources/co_all.txt"
const RESOURCES_FILE = "../resources/res_all.txt"
const OUTPUT_FILE = "../resources/resources.json"

const PATTERNS = new Map<string, PatternFilter>([
  [
    "res",
    {
      include: [/^\([0-9A-Z]{8}\)\tRes(?:Inorg|Org)/],
      exclude: [/test/i, /Fauna(?:Herbivore|Carnivore)/i]
    }
  ],
  [
    "co",
    {
      include: [
        /^\([0-9A-Z]{8}\)\tco_mfg_/,
        /^\([0-9A-Z]{8}\)\tco_Outpost_(Builder|Crafting|Harvester|Misc|Power|Storage)/
      ],
      exclude: [
        /test/i,
        /NOCLUTTER/i,
        /CargoLink02LandingPad_Fueled/,
        /LandingPad_StationRocket01/,
        /OutpostPI_Terminal01/,
        /OutpostPowerFueledGenerator01/
      ]
    }
  ]
])

// Get base resources
const resLines: string[] = filterLines(await getAllLines(RESOURCES_FILE), "res")
console.debug(`Base resources lines: ${resLines.length}`)

const baseResources: Resource[] = resLines.map(line => {
  const cols: string[] = line.split("\t").map(col => col.trim())
  const id: ResourceId = cols[1].replace(/^Res/, "")
  const name: string = cols[8]
  return { id, name }
})

// Get constructible resources
const coLines: string[] = filterLines(
  await getAllLines(CONSTRUCTIBLES_FILE),
  "co"
)
console.debug(`Construcible resources lines: ${coLines.length}`)

const coResources: Resource[] = coLines.slice(0, 500).map(line => {
  // FIXME: Remove temp slice
  const cols: string[] = line.split("\t")
  const id: ResourceId = cols[14]
  const name: string = cols[14]
  const inputs: [ResourceId, number][] = cols[27]
    .split(",")
    .map((res): [ResourceId, number] => {
      const [resId, qty] = res.split("::")
      return [resId.trim().replace(/^Res/, "") as ResourceId, Number(qty)]
    })
  const blueprint: Record<ResourceId, number> = Object.fromEntries(inputs)
  return {
    id,
    name,
    blueprint
  }
})

const sanitizedCoResources: Resource[] = coResources
  .filter(res => !/List$/.test(res.id))
  .reduce((result: Resource[], resource: Resource) => {
    const idPatterns: [RegExp, string][] = [
      [/02_Med/, "02"],
      [/03_Large/, "03"],
      [/01Sm$/, "_01"],
      [/01Med$/, "_02"],
      [/01Large$/, "_03"],
      [/WindTurbineList/, "WindTurbine"],
      [/CrewStation01/, "CrewStation"],
      [/CargoLink01LandingPad/, "CargoLinkLandingPad"],
      [/LandingPad01_Shipbuilder/, "LandingPadShipbuilder"],
      [/LandingPad01$/, "LandingPad02"],
      [/LandingPad01Small/, "LandingPad01"],
      [/TransferContainer01/, "TransferContainer"],
      [/_([a-z0-9]+)_(01|02|03)$/i, "_$2_$1"],
      [
        /Harvester(Atmosphere|Gas|Liquid|Solid)_(01|02|03)(_[a-zA-Z0-9]+)$/,
        "Harvester$1_$2"
      ],
      [/([a-z])(01|02|03)/, "$1_$2"],
      [/_01$/, "Small"],
      [/_02$/, "Medium"],
      [/_03$/, "Large"]
    ]
    const correctedId = idPatterns.reduce(
      (result: ResourceId, pattern: [RegExp, string]) =>
        result.replace(pattern[0], pattern[1]),
      resource.id
    )

    const namePatterns: [RegExp, string][] = [
      [/^Mfg_.+_([a-z]+)$/gi, "$1"],
      [/BuilderOrganic(Fauna|Flora)/, "$1Builder"],
      [/OutpostPI_Power/, "OutpostPI"],
      [/OutpostPI_/, ""],
      [/OutpostPower_/, ""],
      [/Workbench([a-z]+)/i, "$1Workbench"],
      [/OutpostHarvester(Atmosphere|Gas|Liquid|Solid)/, "$1Extractor"],
      [/OutpostScan/, "Scan"],
      [/OutpostStorage(Gas|Liquid|Solid)/, "$1Storage"],
      [/LandingPadShipbuilder/, "LandingPadWithShipbuilder"],
      [/^SQ_/, ""],
      [/([A-Z])/g, " $1"],
      [/^ /, ""]
    ]
    const correctedName = namePatterns.reduce(
      (result: ResourceId, pattern: [RegExp, string]) =>
        result.replace(pattern[0], pattern[1]),
      correctedId
    )
    const newResource: Resource = {
      id: correctedId,
      name: correctedName,
      blueprint: resource.blueprint
    }
    if (result.includes(newResource)) {
      return [...result]
    }
    return [...result, newResource]
  }, new Array<Resource>())

// Write output
const resources: Record<ResourceId, Resource> = Object.fromEntries(
  [...baseResources, ...sanitizedCoResources].map(res => [res.id, res])
)
const content = JSON.stringify(resources, null, 2)
await fs.writeFile(OUTPUT_FILE, content)

console.log("Done.")

// Utility functions
function filterLines(lines: string[], filterKey: string): string[] {
  const filters = PATTERNS.get(filterKey)!
  return lines.filter(
    line =>
      filters.include.some(pattern => pattern.test(line)) &&
      filters.exclude.every(pattern => !pattern.test(line))
  )
}

async function getAllLines(file: string): Promise<string[]> {
  const data = await fs.readFile(file, { encoding: "utf-8" })
  const allLines = data.split("\n").filter(line => line.trim().length > 0)
  const columnsCheck = allLines.reduce(
    (acc: Map<number, number>, line: string) => {
      const columns = line.split("\t").length
      acc.set(columns, (acc.get(columns) || 0) + 1)
      return acc
    },
    new Map<number, number>()
  )
  console.debug(`All lines for ${file}: ${allLines.length}`)
  if ([...columnsCheck.keys()].length > 1) {
    throw new Error("Malformed export file.")
  }
  return allLines
}
