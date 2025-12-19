import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram } from "lucide-react"
import { siteConfig } from "@/config/site"

export function SocialButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button asChild variant="outline" className="flex-1">
        <a
          href={siteConfig.links.facebookMessenger}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Message on Facebook
        </a>
      </Button>
      <Button asChild variant="outline" className="flex-1">
        <a
          href={siteConfig.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="mr-2 h-4 w-4" />
          Instagram DM
        </a>
      </Button>
    </div>
  )
}

