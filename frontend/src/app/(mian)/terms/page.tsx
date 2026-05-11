import SectionHeader from "@/components/main/section-header";

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: "By accessing or using CeleBrease, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.",
    },
    {
        title: "2. Eligibility",
        body: "You must be at least 18 years old and able to enter into a legally binding agreement to use our services. By placing an order, you confirm that the information you provide is accurate and complete.",
    },
    {
        title: "3. Accounts & Security",
        body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Please notify us immediately of any unauthorized use or security breach.",
    },
    {
        title: "4. Orders & Payments",
        body: "All orders are subject to availability and confirmation of the rental price. We reserve the right to refuse or cancel any order at our discretion. Payments are processed securely through our authorized payment partners.",
    },
    {
        title: "5. Rentals & Subscriptions",
        body: "Rentals and subscription plans are governed by our Rental Agreement. Subscriptions renew automatically unless canceled before the next billing cycle. You can manage your plan from your account dashboard at any time.",
    },
    {
        title: "6. Intellectual Property",
        body: "All content on CeleBrease — including text, graphics, logos, images, and software — is the property of CeleBrease or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or modify any content without prior written consent.",
    },
    {
        title: "7. Prohibited Use",
        body: "You agree not to use our services for any unlawful, harmful, or fraudulent purpose. This includes, but is not limited to, reselling rented items, tampering with our platform, or violating the rights of others.",
    },
    {
        title: "8. Limitation of Liability",
        body: "CeleBrease is not liable for indirect, incidental, or consequential damages arising from your use of our services. Our total liability is limited to the amount paid for the specific rental or subscription in question.",
    },
    {
        title: "9. Changes to These Terms",
        body: "We may update these Terms of Service from time to time. Continued use of our services after changes are posted constitutes your acceptance of the revised terms. We encourage you to review this page periodically.",
    },
    {
        title: "10. Governing Law",
        body: "These terms are governed by the laws of the jurisdiction in which CeleBrease operates. Any disputes arising from these terms will be resolved through good-faith negotiation, and, if necessary, in the appropriate courts.",
    },
];

export default function TermsPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20 relative">
                <SectionHeader
                    title="Terms of Service"
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
                        about these terms, please contact us at support@celebrease.com.
                    </p>
                </div>
            </div>
        </section>
    );
}
