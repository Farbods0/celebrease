import SectionHeader from "@/components/main/section-header";

const sections = [
    {
        title: "1. Information We Collect",
        body: "We collect information you provide directly to us — such as your name, email, shipping address, and payment details — when you create an account, place an order, or contact support. We also collect limited technical data (browser type, device, IP address) to keep our platform secure and improve your experience.",
    },
    {
        title: "2. How We Use Your Information",
        body: "We use your information to process rentals and subscriptions, deliver and pick up kits, communicate order updates, personalize recommendations, and improve our services. We never sell your personal data to third parties.",
    },
    {
        title: "3. Cookies & Tracking",
        body: "We use cookies and similar technologies to remember your preferences, keep you signed in, and understand how you interact with our site. You can disable cookies in your browser settings, though some features may not function correctly without them.",
    },
    {
        title: "4. Sharing of Information",
        body: "We share your information only with trusted partners who help us operate our service — such as payment processors, shipping carriers, and analytics providers. These partners are contractually required to protect your data and use it only for the purposes we specify.",
    },
    {
        title: "5. Data Security",
        body: "We implement industry-standard safeguards to protect your information, including encrypted transmission, secure storage, and restricted access. While no system is fully secure, we continuously monitor and improve our practices.",
    },
    {
        title: "6. Data Retention",
        body: "We retain your information for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your data at any time, subject to legal requirements.",
    },
    {
        title: "7. Your Rights",
        body: "You have the right to access, correct, or delete your personal information, and to opt out of marketing communications. To exercise these rights, contact us at support@celebrease.com and we'll respond within a reasonable timeframe.",
    },
    {
        title: "8. Children's Privacy",
        body: "CeleBrease is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their data, please contact us so we can promptly remove it.",
    },
    {
        title: "9. Third-Party Links",
        body: "Our site may contain links to third-party websites or services. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before sharing any information.",
    },
    {
        title: "10. Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. When we do, we'll revise the date below and, where appropriate, notify you by email. Your continued use of our services constitutes acceptance of the updated policy.",
    },
];

export default function PrivacyPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20 relative">
                <SectionHeader
                    title="Privacy Policy"
                    subtitle="Legal"
                />

                <div className="max-w-4xl mx-auto bg-white border rounded-2xl p-6 md:p-10 lg:p-12 space-y-10">
                    {sections.map((section) => (
                        <section key={section.title} className="space-y-3">
                            <h3 className="text-xl lg:text-2xl font-semibold font-heading">{section.title}</h3>
                            <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">{section.body}</p>
                        </section>
                    ))}

                    <p className="text-sm text-muted-foreground pt-4 border-t">
                        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. If you have questions
                        about this policy, please contact us at support@celebrease.com.
                    </p>
                </div>
            </div>
        </section>
    );
}
