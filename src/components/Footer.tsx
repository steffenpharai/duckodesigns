import Link from "next/link"
import { Facebook, Instagram, Mail } from "lucide-react"
import { siteConfig } from "@/config/site"

export function Footer() {
  const policyLinks = [
    { href: "/policies/shipping", label: "Shipping" },
    { href: "/policies/returns", label: "Returns" },
    { href: "/policies/privacy", label: "Privacy" },
  ]

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base sm:text-lg font-bold">Ducko Designs</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-muted-foreground hover:text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary min-h-[32px] flex items-center"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-order"
                  className="text-muted-foreground hover:text-primary min-h-[32px] flex items-center"
                >
                  Custom Order
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary min-h-[32px] flex items-center"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary min-h-[32px] flex items-center"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold">Policies</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary min-h-[32px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold">Get in Touch</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-muted-foreground hover:text-primary break-all min-h-[32px] flex items-center"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.facebookMessenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary min-h-[32px] flex items-center"
                >
                  Message on Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 border-t pt-6 md:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ducko Designs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

