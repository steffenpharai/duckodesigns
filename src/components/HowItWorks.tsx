import { ShoppingBag, Palette, Truck } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: ShoppingBag,
      title: "Browse",
      description: "Explore our collection of car seat-friendly ponchos or get inspired by our custom designs.",
    },
    {
      icon: Palette,
      title: "Customize",
      description: "Choose your fabric, colors, and personalization options. We'll work with you to create the perfect piece.",
    },
    {
      icon: Truck,
      title: "Delivery",
      description: "Your custom poncho is handmade with care and delivered to your door, ready to keep your little one warm.",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-muted-foreground">
          Getting your perfect poncho is simple
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-primary">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

