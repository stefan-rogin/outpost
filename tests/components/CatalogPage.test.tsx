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
    expect(getNavOption(sidedLeft, "next")).toBe("OutpostStorageSolidMedium")
    expect(getNavOption(sidedLeft, "prev")).toBe("OutpostStorageSolidLarge")

    const sidedRight = {
      ...testGroups[0],
      inView: storageSolidLarge
    }
    expect(getNavOption(sidedRight, "next")).toBe("OutpostStorageSolidSmall")
    expect(getNavOption(sidedRight, "prev")).toBe("OutpostStorageSolidMedium")

    const singleOption = {
      ...testGroups[1],
      inView: transferContainer
    }
    expect(getNavOption(singleOption, "next")).toBe("OutpostTransferContainer")
    expect(getNavOption(singleOption, "prev")).toBe("OutpostTransferContainer")
  })
})
