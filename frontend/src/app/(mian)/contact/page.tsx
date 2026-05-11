"use client";

import SectionHeader from "@/components/main/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail01Icon, MapPinIcon, PhoneCall } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setIsSubmitting(false);
        toast.success("Message sent! We'll get back to you soon.");
        (e.target as HTMLFormElement).reset();
    }

    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20 relative">
                <SectionHeader title="We'd love to hear from you" subtitle="Contact Us" />

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <p className="text-base lg:text-lg leading-relaxed">
                            Whether you have questions about your subscription, need help with a return, or just want to say hi — our team
                            is here to help. Reach out and we&apos;ll get back to you within 24 hours.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-6 border rounded-2xl space-y-3 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-12 bg-linear-to-r from-primary to-secondary text-white rounded-xl flex justify-center items-center">
                                    <HugeiconsIcon icon={Mail01Icon} />
                                </div>
                                <h3 className="font-semibold text-lg">Email</h3>
                                <p className="text-muted-foreground">support@celebrease.com</p>
                            </div>

                            <div className="p-6 border rounded-2xl space-y-3 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-12 bg-linear-to-r from-primary to-secondary text-white rounded-xl flex justify-center items-center">
                                    <HugeiconsIcon icon={PhoneCall} />
                                </div>
                                <h3 className="font-semibold text-lg">Phone</h3>
                                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            </div>

                            <div className="p-6 border rounded-2xl space-y-3 hover:-translate-y-1 transition-all duration-300 sm:col-span-2">
                                <div className="size-12 bg-linear-to-r from-primary to-secondary text-white rounded-xl flex justify-center items-center">
                                    <HugeiconsIcon icon={MapPinIcon} />
                                </div>
                                <h3 className="font-semibold text-lg">Office</h3>
                                <p className="text-muted-foreground">San Francisco, California, United States</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 border rounded-2xl bg-white space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" placeholder="Jane" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" placeholder="Doe" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="jane@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="How can we help?" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Tell us what's on your mind..." rows={5} required />
                        </div>

                        <Button variant="black" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
