"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { Mail, Facebook, Instagram } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In production, this would send to an API endpoint
    // For now, we'll just show success
    setTimeout(() => {
      setIsSuccess(true)
      setFormData({ name: "", email: "", message: "" })
      setIsSubmitting(false)
    }, 1000)
  }

  if (isSuccess) {
    return (
      <div className="container py-8 md:py-12 max-w-2xl">
        <Card>
          <CardContent className="pt-4 md:pt-6 text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Message Sent!</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Thank you for contacting us. We&apos;ll get back to you soon.
            </p>
            <Button asChild className="min-h-[44px]">
              <a href="/">Return Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 max-w-2xl">
      <div className="space-y-6 md:space-y-8">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Have a question? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base">Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm sm:text-base text-primary hover:underline break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <p className="font-semibold text-sm sm:text-base">Social Media</p>
                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline" className="w-full min-h-[44px]">
                    <a
                      href={siteConfig.links.facebookMessenger}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Message on Facebook
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full min-h-[44px]">
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="min-h-[44px] text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="min-h-[44px] text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="text-base resize-y"
                  />
                </div>

                <Button type="submit" className="w-full min-h-[44px]" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

