"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4 md:hidden">
      <Button asChild className="w-full" size="lg">
        <Link href="/custom-order">{siteConfig.cta.primary}</Link>
      </Button>
    </div>
  )
}

