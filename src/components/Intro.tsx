"use client"

import styles from "@/components/Intro.module.css"
import Link from "next/link"
import { useEffect, useState } from "react"

export const Intro = ({
  isLoading,
  isError,
  isEmptyWorkspace
}: {
  isLoading: boolean
  isError: boolean
  isEmptyWorkspace: boolean
}) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false)

  useEffect(() => setHasMounted(true), [])
  if (!hasMounted) return null

  return (
    <div className={styles.intro}>
      {isEmptyWorkspace && (
        <>
          <h3 className={styles.title}>Starfield Outpost Planner</h3>
          <p>
            Start building your outpost by selecting modules from the panel on
            the left. Your project is automatically saved in your browser&apos;s
            local storage and typically persists across visits on the same
            device.
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
            planetary conditions. The planner displays a median value, but
            actual energy production may be higher or lower depending on the
            environment.
          </p>
          <h4>📋 Export Your Materials</h4>
          <p>
            Use the button on the right to copy your current materials list,
            complete with all deconstruction choices, to your clipboard.
          </p>
        </>
      )}
      {isError && (
        <>
          <h3 className={styles.title}>⚠️Error</h3>
          <p>We encountered a problem while loading the specified project.</p>
          <h5>Potential Causes</h5>
          <ul>
            <li>
              <strong>Invalid URL:</strong> The provided URL doesn&apos;t
              correspond to any saved project. Please double-check for
              copy/paste errors.
            </li>
            <li>
              <strong>Invalid URL import:</strong> If you used an URL containing
              an exported project, the project could not be extracted. Please
              double-check for copy/paste errors.
            </li>
            <li>
              <strong>Corrupted Save:</strong> The saved project&apos;s
              structure is unreadable and unfortunately cannot be recovered.
            </li>
            <li>
              <strong>Unexpected Issue:</strong> You may have uncovered a new
              bug.
            </li>
          </ul>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </>
      )}
      {isLoading && <h3 className={styles.title}>Loading...</h3>}
    </div>
  )
}
