import { CatalogConfigCategory } from "@/models/catalog"

export const catalogConfig: CatalogConfigCategory[] = [
  {
    title: "Extractors",
    items: [
      [
        "OutpostHarvesterAtmosphere_01",
        "OutpostHarvesterAtmosphere_02_Med",
        "OutpostHarvesterAtmosphere_03_Large"
      ],
      [
        "OutpostHarvesterGas_01",
        "OutpostHarvesterGas_02_Med",
        "OutpostHarvesterGas_03_Large"
      ],
      [
        "OutpostHarvesterLiquid_01",
        "OutpostHarvesterLiquid_02_Med",
        "OutpostHarvesterLiquid_03_Large"
      ],
      [
        "OutpostHarvesterSolid_01",
        "OutpostHarvesterSolid_02_Med",
        "OutpostHarvesterSolid_03_Large"
      ]
    ]
  },
  {
    title: "Power",
    items: [
      ["OutpostPower_SolarArrayList"],
      ["OutpostPower_SolarDomeList"],
      ["OutpostPower_WindTurbineList01"],
      ["OutpostPower_WindTurbineList02"],
      ["OutpostPowerFueledGenerator01"],
      ["OutpostPI_Power_PowerReactor01"],
      ["OutpostPI_Power_PowerReactor02"]
    ]
  },
  {
    title: "Storage",
    items: [
      ["OutpostTransferContainer01"],
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
      [
        "OutpostStorageWarehouse01Sm",
        "OutpostStorageWarehouse01Med",
        "OutpostStorageWarehouse01Large"
      ]
    ]
  },
  {
    title: "Builders",
    items: [
      ["OutpostBuilder_Assembled01List"],
      ["OutpostBuilder_Assembled02List"],
      ["OutpostBuilder_Assembled03List"],
      [
        "OutpostPI_BuilderOrganicFauna01",
        "OutpostPI_BuilderOrganicFauna02",
        "OutpostPI_BuilderOrganicFauna03"
      ],
      [
        "OutpostPI_BuilderOrganicFlora01",
        "OutpostPI_BuilderOrganicFlora02",
        "OutpostPI_BuilderOrganicFlora03"
      ]
    ]
  },
  {
    title: "Crafting",
    items: [
      ["WorkbenchIndustrial"],
      ["WorkbenchFood"],
      ["WorkbenchChem"],
      ["WorkbenchWeapon"],
      ["WorkbenchArmor"],
      ["WorkbenchResearch"]
    ]
  },
  {
    title: "Structures",
    items: [
      ["OutpostStructureAirlocksList01"],
      [
        "OutpostPI_OPK_OpiHabFourWall01",
        "OutpostPI_OPK_OpiHabFourWall01Double"
      ],
      ["OutpostStructureHydroponicsHabsList01"],
      ["OutpostStructureScienceHabsList01"],
      ["OutpostPI_OPK_OpmHabFourWall01"],
      ["OutpostStructureRoundHabsList01"],
      ["OutpostPI_OPK_OpiHabSmMidHex01", "OutpostPI_OPK_OpiHabLgMidHex01"],
      ["OutpostStructures_HallwaysList"],
      ["OutpostPI_Structure_Watchtower01"]
    ]
  },
  {
    title: "Miscellaneous",
    items: [
      ["OutpostScanBooster01", "OutpostScanBooster02", "OutpostScanBooster03"],
      [
        "OutpostPI_CargoLink01LandingPad",
        "OutpostPI_CargoLink02LandingPad_Fueled"
      ],
      ["OutpostPI_CrewStation01"],
      ["OutpostPI_LandingPad01_Shipbuilder", "OutpostPI_LandingPad01Small"],
      ["OutpostMiscMissionBoardList"],
      ["SQ_ClearBountyTerminal"]
    ]
  }
]
