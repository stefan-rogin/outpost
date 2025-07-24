import NextLink from "next/link"
import Image from "next/image"
import styles from "@/components/Link.module.css"

export const Link = ({ href, content }: { href: string; content: string }) => (
  <div className={styles.container}>
    <Image
      priority={true}
      src="/next.svg"
      alt="All projects page"
      width={16}
      height={16}
      className={styles.link_icon}
    />
    <NextLink href={href} className={styles.link}>
      {content}
    </NextLink>
  </div>
)
