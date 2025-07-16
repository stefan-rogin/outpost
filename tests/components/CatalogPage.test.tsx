import { CatalogGroup } from "@/models/catalog"
import { getNavOption } from "@/components/CatalogPage"
import {
  testGroups,
  storageSolidSmall,
  storageSolidLarge,
  transferContainer
} from "../testObjects"

describe("CatalogPage tests", () => {
  test("getNavOption scrolls through options", () => {
    const sidedLeft: CatalogGroup = {
      ...testGroups[0],
      inView: storageSolidSmall
    }
    expect(getNavOption(sidedLeft, "next")).toBe("OutpostStorageSolid01Med")
    expect(getNavOption(sidedLeft, "prev")).toBe("OutpostStorageSolid01Large")

    const sidedRight = {
      ...testGroups[0],
      inView: storageSolidLarge
    }
    expect(getNavOption(sidedRight, "next")).toBe("OutpostStorageSolid01Sm")
    expect(getNavOption(sidedRight, "prev")).toBe("OutpostStorageSolid01Med")

    const singleOption = {
      ...testGroups[1],
      inView: transferContainer
    }
    expect(getNavOption(singleOption, "next")).toBe(
      "OutpostTransferContainer01"
    )
    expect(getNavOption(singleOption, "prev")).toBe(
      "OutpostTransferContainer01"
    )
  })
})
