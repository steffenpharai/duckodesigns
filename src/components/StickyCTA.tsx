"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export function StickyCTA() {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t p-4 md:hidden shadow-lg"
      style={{
        paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`,
      }}
    >
      <Button asChild className="w-full min-h-[44px]" size="lg">
        <Link href="/custom-order">{siteConfig.cta.primary}</Link>
      </Button>
    </div>
  )
}

