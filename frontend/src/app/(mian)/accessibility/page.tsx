import SectionHeader from "@/components/main/section-header";

const sections = [
    {
        title: "1. Our Commitment",
        body: "At CeleBrease, we are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure our services are inclusive.",
    },
    {
        title: "2. Conformance Status",
        body: "We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA standards. These guidelines explain how to make web content more accessible for people with a wide range of disabilities.",
    },
    {
        title: "3. Accessibility Features",
        body: "Our platform is designed with accessibility in mind, including high-contrast color ratios, keyboard-navigable menus, and ARIA labels for screen readers. We aim to provide a seamless experience regardless of the technology used to access our site.",
    },
    {
        title: "4. Compatibility",
        body: "CeleBrease is designed to be compatible with modern assistive technologies and the last two versions of major browsers including Chrome, Safari, Firefox, and Edge. Some older browsers may not fully support all accessibility features.",
    },
    {
        title: "5. Technical Specifications",
        body: "Accessibility of CeleBrease relies on HTML, WAI-ARIA, CSS, and JavaScript technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer.",
    },
    {
        title: "6. Feedback & Assistance",
        body: "We welcome your feedback on the accessibility of our platform. If you encounter accessibility barriers or have difficulty using any part of our website, please let us know. We aim to respond to feedback within 3 business days.",
    },
    {
        title: "7. Third-Party Content",
        body: "While we strive to ensure our own platform is accessible, some third-party content (such as integrated maps or social media feeds) may not fully meet our standards. We actively encourage our partners to provide accessible content.",
    },
    {
        title: "8. Ongoing Efforts",
        body: "Accessibility is an ongoing journey. We conduct regular audits and user testing to identify and fix potential issues, ensuring that CeleBrease remains an easy and celebratory experience for everyone.",
    },
];

export default function AccessibilityPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20 relative">
                <SectionHeader
                    title="Accessibility Statement"
                    subtitle="Inclusion"
                />

                <div className="max-w-4xl mx-auto bg-white border rounded-2xl p-6 md:p-10 lg:p-12 space-y-10">
                    {sections.map((section) => (
                        <section key={section.title} className="space-y-3">
                            <h3 className="text-xl lg:text-2xl font-semibold font-heading">{section.title}</h3>
                            <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">{section.body}</p>
                        </section>
                    ))}

                    <div className="pt-4 border-t space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            If you have questions about our accessibility efforts or need assistance, please contact our support team at{" "}
                            <a href="mailto:support@celebrease.com" className="text-primary font-medium hover:underline">
                                support@celebrease.com
                            </a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}