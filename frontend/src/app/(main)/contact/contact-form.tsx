"use client";

import { useAppForm } from "@/components/form/form-context";
import { submitContact } from "@/lib/api/contact";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    subject: z.string().trim().min(1, "Please choose a topic"),
    message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
    const form = useAppForm({
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        validators: {
            onChange: contactSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                // Split full name into firstName / lastName for the existing API shape
                const parts = value.name.trim().split(/\s+/);
                const firstName = parts[0] ?? "";
                const lastName = parts.slice(1).join(" ") || firstName;
                await submitContact({ firstName, lastName, email: value.email, subject: value.subject, message: value.message });
                toast.success("Message sent! We'll get back to you within 4 hours.");
                form.reset();
            } catch {
                toast.error("Failed to send message. Please try again.");
            }
        },
    });

    return (
        <div className="contact-form-card">
            <h2>Send us a message</h2>
            <p className="form-sub">Fill in the form and we&apos;ll get back to you before your next holiday arrives.</p>

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                {/* Name + Email side by side on desktop */}
                <div className="fields-row">
                    <form.AppField name="name">
                        {(field) => (
                            <div className="field">
                                <label htmlFor="cname">Full name</label>
                                <input
                                    id="cname"
                                    type="text"
                                    placeholder="Jane Smith"
                                    autoComplete="name"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <span style={{ color: "var(--cb-magenta)", fontSize: 12 }}>
                                        {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                                    </span>
                                )}
                            </div>
                        )}
                    </form.AppField>

                    <form.AppField name="email">
                        {(field) => (
                            <div className="field">
                                <label htmlFor="cemail">Email address</label>
                                <input
                                    id="cemail"
                                    type="email"
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                    <span style={{ color: "var(--cb-magenta)", fontSize: 12 }}>
                                        {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                                    </span>
                                )}
                            </div>
                        )}
                    </form.AppField>
                </div>

                {/* Topic dropdown */}
                <form.AppField name="subject">
                    {(field) => (
                        <div className="field" style={{ marginTop: 2 }}>
                            <label htmlFor="csubject">What&apos;s this about?</label>
                            <select
                                id="csubject"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                            >
                                <option value="">Choose a topic…</option>
                                <option value="order">Order or delivery question</option>
                                <option value="return">Kit return or refund</option>
                                <option value="subscription">Subscription &amp; billing</option>
                                <option value="kit">Kit feedback or swap request</option>
                                <option value="damage">Damage or missing item</option>
                                <option value="partnership">Partnership or press inquiry</option>
                                <option value="general">General question</option>
                            </select>
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                <span style={{ color: "var(--cb-magenta)", fontSize: 12 }}>
                                    {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                                </span>
                            )}
                        </div>
                    )}
                </form.AppField>

                {/* Message */}
                <form.AppField name="message">
                    {(field) => (
                        <div className="field">
                            <label htmlFor="cmessage">Your message</label>
                            <textarea
                                id="cmessage"
                                placeholder="Tell us how we can help, the more detail, the faster we can assist."
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                style={{ height: "auto", padding: "14px 16px", minHeight: 148, resize: "vertical", lineHeight: 1.6, width: "100%", border: "1.5px solid var(--cb-line)", borderRadius: "var(--cb-r-card)" }}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                <span style={{ color: "var(--cb-magenta)", fontSize: 12 }}>
                                    {String(field.state.meta.errors[0]?.message ?? field.state.meta.errors[0])}
                                </span>
                            )}
                        </div>
                    )}
                </form.AppField>

                <div className="form-submit-row">
                    <form.Subscribe selector={(s) => s.isSubmitting}>
                        {(isSubmitting) => (
                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending…" : "Send Message →"}
                            </button>
                        )}
                    </form.Subscribe>
                </div>
            </form>
        </div>
    );
}
