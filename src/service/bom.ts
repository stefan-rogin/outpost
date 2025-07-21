import { Tier, Scarcity, Bill, BomItem } from "@/models/bom"
import { Order, OrderItem } from "@/models/order"
import {
  Constructible,
  BaseResource,
  isConstructible,
  ResourceId
} from "@/models/resource"
import { getResource } from "@/service/resource"

type AggregateOptions = {
  resultType: "items" | "deconstructed"
  deconstruct: "list" | "all"
  deconstructed: ResourceId[]
  isOrderItem: boolean
}

export function getTier(constructible: Constructible): Tier | undefined {
  const tierMatch = constructible.id.match(/^(?:Mfg_)(Tier01|Tier02|Tier03)/)
  if (!tierMatch) return undefined
  return tierMatch[1] as Tier
}

export function getScarcity(baseResource: BaseResource): Scarcity | undefined {
  const scarcityMatch = baseResource.id.match(
    /^(?:Inorg|Org)(Common|Uncommon|Rare|Exotic|Unique)/
  )
  if (!scarcityMatch) return undefined
  return scarcityMatch[1] as Scarcity
}

export function getCsvFromProject(bill: Bill, order: Order): string {
  const bomExport: string = bill
    .values()
    .reduce(
      (acc: string, billItem: BomItem): string =>
        acc + `${billItem.quantity},${billItem.item.name}\n`,
      ""
    )
  const orderExport = order
    .values()
    .reduce(
      (acc: string, orderItem: OrderItem) =>
        acc + `${orderItem.quantity}, ${orderItem.item.name}\n`,
      ""
    )
  return `${orderExport}\n${bomExport}`
}

export function getAggregatedItems(
  order: Order,
  deconstructed: ResourceId[]
): Bill {
  const opts: Partial<AggregateOptions> = {
    resultType: "items",
    deconstruct: "list",
    deconstructed
  }
  return aggregateBlueprints(order, opts)
}

export function getAggregatedDeconstructed(
  order: Order,
  deconstructed: ResourceId[]
): Bill {
  const opts: Partial<AggregateOptions> = {
    resultType: "deconstructed",
    deconstruct: "list",
    deconstructed
  }
  return aggregateBlueprints(order, opts)
}

function aggregateBlueprints(
  order: Order,
  options: Partial<AggregateOptions> = {}
): Bill {
  const defaultOpts: AggregateOptions = {
    resultType: "items",
    deconstruct: "list",
    deconstructed: [],
    isOrderItem: false
  }
  const opts: AggregateOptions = { ...defaultOpts, ...options }
  const result: Bill = new Map()

  for (const orderItem of order.values()) {
    const itemResult = getBomForInput(
      orderItem.item.id,
      orderItem.quantity,
      new Map(),
      { ...opts, isOrderItem: true }
    )
    for (const bomResource of itemResult.values()) {
      mergeResource(result, bomResource)
    }
  }
  return result
}

function getBomForInput(
  id: ResourceId,
  qty: number,
  acc: Bill,
  options: AggregateOptions
): Bill {
  const result: Bill = new Map(acc)
  const resource = getResource(id)
  const opts = options

  if (resource == undefined) return result

  if (opts.resultType === "deconstructed") {
    if (opts.deconstructed.includes(id)) {
      mergeResource(result, { item: resource, quantity: qty })
    }
  } else {
    // opts.resultType === "items"
    if (
      !isConstructible(resource) ||
      (opts.deconstruct == "list" &&
        !opts.deconstructed.includes(id) &&
        !opts.isOrderItem)
    ) {
      mergeResource(result, {
        item: resource,
        quantity: qty
      })
      return result
    }
  }

  if (isConstructible(resource)) {
    for (const [blueprintId, blueprintQty] of Object.entries(
      resource.blueprint
    )) {
      const nextResult = getBomForInput(
        blueprintId,
        blueprintQty * qty,
        new Map(),
        { ...opts, isOrderItem: false }
      )
      for (const resourceFromBlueprint of nextResult.values()) {
        mergeResource(result, resourceFromBlueprint)
      }
    }
  }

  return result
}

function mergeResource(prev: Bill, newResource: BomItem): void {
  const id = newResource.item.id
  const existing = prev.get(id)
  prev.set(id, {
    item: newResource.item,
    quantity: (existing?.quantity || 0) + newResource.quantity
  })
}
