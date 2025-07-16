// $ npx tsx ./parse_export.ts
// or
// $ node --loader ts-node/esm ./parse_export.ts

import fs from "node:fs/promises"
import {
  Resource,
  Constructible,
  BaseResource,
  ResourceId,
  Blueprint
} from "@/models/resource"
import name_map from "@/lib/resources/name_map.json"

type PatternFilter = {
  include: RegExp[]
  exclude: RegExp[]
}

const CONSTRUCTIBLES_FILE = "./co_all.txt"
const RESOURCES_FILE = "./res_all.txt"
const OUTPUT_FILE = "./resources.json"
const ICONS_PATH = "../../../public/icons"

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
        /^\([0-9A-Z]{8}\)\tco_Outpost_(Builder|Crafting|Harvester|Misc|Power|Storage|Structure)/
      ],
      exclude: [
        /test/i,
        /^(?!.*Mfg_Tier03_RothiciteMagnet_NOCLUTTER).*NOCLUTTER/i,
        /LandingPad_StationRocket01/,
        /OutpostStructureFourWallHabsList01/,
        /OutpostPI_OPK_OpiHabFourWall01_Crafting/,
        /OutpostStructureHexHabsList01/,
        /OutpostStructurePlatformsList01/,
        /Outpost_Misc_PI_LandingPad01New/,
        /OutpostPI_Terminal01/,
        /OutpostHarvester(?:Atmosphere|Gas|Liquid|Solid)_(?:[a-z3]+)List/i,
        /OutpostBuilderOrganic_(?:Fauna|Flora)List/,
        /OutpostStorage_ScanBoosterList/,
        /OutpostStorage_(?:Gas|Liquid|Solid|Warehouse)List/
      ]
    }
  ]
])

const nameMap: Map<string, string> = new Map(name_map as [string, string][])

// Get base resources
const resLines: string[] = filterLines(await getAllLines(RESOURCES_FILE), "res")
console.debug(`Base resources lines: ${resLines.length}`)

const baseResources: BaseResource[] = resLines.map(line => {
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
console.debug(`Constructible resources lines: ${coLines.length}`)

const constructibles: Constructible[] = coLines.map(line => {
  const cols: string[] = line.split("\t")
  const id: ResourceId = cols[14].replace(
    "Mfg_Tier03_RothiciteMagnet_NOCLUTTER",
    "Mfg_Tier03_RothiciteMagnet"
  ) // An exception
  const name: string = cols[14]
  const inputs: [ResourceId, number][] = cols[27]
    .split(",")
    .map((res): [ResourceId, number] => {
      const [resId, qty] = res.split("::")
      return [resId.trim().replace(/^Res/, "") as ResourceId, Number(qty)]
    })
  const blueprint: Blueprint = Object.fromEntries(inputs)
  return {
    id,
    name,
    blueprint
  }
})

const sanitizedConstructibles: Map<ResourceId, Constructible> =
  constructibles.reduce((result, resource) => {
    const correctedId = resource.id.replace(
      /Harvester(Atmosphere|Gas|Liquid|Solid)(?:_[a-z0-9]+)_(01|02|03)/i,
      "Harvester$1_$2"
    )
    const name = nameMap.get(correctedId) ?? correctedId
    if (!nameMap.has(correctedId)) console.log(`Name missing: ${correctedId}`)
    const newConstructible: Constructible = {
      id: correctedId,
      name: name,
      blueprint: resource.blueprint
    }
    result.set(correctedId, newConstructible)
    return result
  }, new Map())

sanitizedConstructibles.forEach(con => {
  fs.access(`${ICONS_PATH}/${con.id}.jpg`).catch(() => {
    if (!/^Mfg_/.test(con.id)) console.log(`Missing icon: ${con.id}`)
  })
})

// Write output
const resources: Record<ResourceId, Resource> = Object.fromEntries(
  [...baseResources, ...sanitizedConstructibles.values()].map(res => [
    res.id,
    res
  ])
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
