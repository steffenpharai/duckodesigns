import { Heart, Palette, Users } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Heart,
      title: "Handmade",
      description: "Each piece crafted with care",
    },
    {
      icon: Palette,
      title: "Custom Fabrics",
      description: "Choose your perfect style",
    },
    {
      icon: Users,
      title: "Family-Owned",
      description: "Made by parents, for parents",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
      {badges.map((badge) => {
        const Icon = badge.icon
        return (
          <div
            key={badge.title}
            className="flex flex-col items-center text-center space-y-2 p-4 sm:p-6 rounded-lg bg-muted/50"
          >
            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h3 className="text-sm sm:text-base font-semibold">{badge.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {badge.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}

