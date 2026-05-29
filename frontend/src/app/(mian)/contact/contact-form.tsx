"use client";

import { useAppForm } from "@/components/form/form-context";
import SectionHeader from "@/components/main/section-header";
import { submitContact } from "@/lib/api/contact";
import { Mail01Icon, MapPinIcon, PhoneCall } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    subject: z.string().trim().min(3, "Subject must be at least 3 characters"),
    message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
    const form = useAppForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
        },
        validators: {
            onChange: contactSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await submitContact(value);
                toast.success("Message sent! We'll get back to you soon.");
                form.reset();
            } catch {
                toast.error("Failed to send message. Please try again.");
            }
        },
    });

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
                    <form
                        className="p-6 md:p-8 border rounded-2xl bg-white space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <div className="grid sm:grid-cols-2 gap-6">
                            <form.AppField name="firstName">
                                {(field) => <field.FormInput type="text" label="First Name" placeholder="Jane" />}
                            </form.AppField>
                            <form.AppField name="lastName">
                                {(field) => <field.FormInput type="text" label="Last Name" placeholder="Doe" />}
                            </form.AppField>
                        </div>

                        <form.AppField name="email">
                            {(field) => <field.FormInput type="email" label="Email" placeholder="jane@example.com" />}
                        </form.AppField>

                        <form.AppField name="subject">
                            {(field) => <field.FormInput type="text" label="Subject" placeholder="How can we help?" />}
                        </form.AppField>

                        <form.AppField name="message">
                            {(field) => <field.FormTextarea label="Message" placeholder="Tell us what's on your mind..." />}
                        </form.AppField>

                        <form.AppForm>
                            <form.FormSubmit label="Send Message" />
                        </form.AppForm>
                    </form>
                </div>
            </div>
        </section>
    );
}
