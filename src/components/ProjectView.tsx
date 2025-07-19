import styles from "@/components/Project.module.css"
import { ResourceId, QtyChange } from "@/models/resource"
import { OrderItemView } from "./OrderItemView"
import { BoM } from "./BoM"
import { Power } from "./Power"
import { Order } from "@/models/order"
import Image from "next/image"

export const ProjectView = ({
  order,
  onQtyChange,
  onClear
}: {
  order: Order
  onQtyChange: (id: ResourceId, action: QtyChange) => () => void
  onClear: () => () => void
}) => (
  <>
    {[...order].length < 1 ? (
      <div className={styles.intro}>
        <h3 className={styles.title}>Starfield Outpost Planner</h3>
        <p>
          Start building your outpost by selecting modules from the panel on the
          left. Your project is automatically saved in your browser&apos;s local
          storage and typically persists across visits on the same device.
        </p>
        <ul>
          <li>Only the list of selected modules is saved.</li>
          <li>Information about deconstructed components is not retained.</li>
        </ul>
        <h4>📦Materials & Component Breakdown</h4>
        <p>
          The bill of materials differentiates between base and manufactured
          resources. Click on any manufactured component to break it down into
          its inputs, good for refining your input requirements to match your
          production chains. Click on a deconstructed component to reverse its
          deconstruction.
        </p>

        <h5>Example</h5>
        <p>
          Selecting a <strong>Landing Pad with Shipbuilder</strong> initially
          requires:
        </p>
        <ul>
          <li>18 x Adaptive Frame</li>
          <li>2 x Zero Wire</li>
          <li>30 x Iron</li>
          <li>2 x Beryllium</li>
        </ul>
        <p>
          Clicking on <strong>Adaptive Frame</strong> changes the list of
          materials into:
        </p>
        <ul>
          <li>2 x Zero Wire</li>
          <li>48 x Iron</li>
          <li>18 x Aluminum</li>
          <li>2 x Beryllium</li>
        </ul>
        <h4>⚡Power</h4>
        <p>
          Output from Wind Turbines, Solar Arrays, and Domes varies based on
          planetary conditions. The planner displays a median value, but actual
          energy production may be higher or lower depending on the environment.
        </p>
        <h4>📋 Export Your Materials</h4>
        <p>
          Use the button on the right to copy your current materials list,
          complete with all deconstruction choices, to your clipboard.
        </p>
      </div>
    ) : (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Project</h3>
          <Image
            priority={true}
            src="delete.svg"
            alt="Delete project"
            width={24}
            height={24}
            className={styles.power_icon}
            onClick={onClear()}
          />
        </div>

        <Power order={order} />
        {[...order].map(([id, item]) => (
          <OrderItemView key={id} orderItem={item} onQtyChange={onQtyChange} />
        ))}
        <BoM order={order} />
      </div>
    )}
  </>
)
