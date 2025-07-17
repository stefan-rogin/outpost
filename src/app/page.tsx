"use client"

import Image from "next/image"
import styles from "@/app/page.module.css"
import { Outpost } from "@/components/Outpost"

const Home = () => (
  <div className={styles.page_layout}>
    <header className={styles.header}>
      <div className={styles.header_title}>
        <Image
          priority={true}
          src="/starfield.svg"
          alt="Starfield Logo"
          width={120}
          height={120}
        />
        <h2>OUTPOST</h2>
        <h3>&middot; PLANNER</h3>
      </div>

      <div className={styles.header_border}>
        <div className={styles.border_bar_1}>&nbsp;</div>
        <div className={styles.border_bar_2}>&nbsp;</div>
        <div className={styles.border_bar_3}>&nbsp;</div>
        <div className={styles.border_bar_4}>&nbsp;</div>
      </div>
    </header>
    <main className={styles.body}>
      <Outpost />
    </main>
    <footer className={styles.footer}>
      <small>
        All images, names, and intellectual property related to Starfield and
        its in-game items are the property of Bethesda Softworks and its
        respective owners. This tool is a fan-created resource and is not
        affiliated with, endorsed by, or associated with Bethesda. Data and
        renderings of modules were obtained using Starfield Creators Kit.
      </small>
    </footer>
  </div>
)

export default Home
