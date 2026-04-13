import SectionHeader from "@/components/main/section-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does the subscription work?",
        answer: "You choose a plan (Starter, Premium, or Ultimate) and enjoy three kits per year. After returning one, you'll be prompted to select your next hobby.",
    },
    {
        question: "What happens to my deposit?",
        answer: "Your deposit is fully refundable once all kits are returned in good condition. It may be used to cover any loss or damage if necessary.",
    },
    {
        question: "Can I pause or skip a holiday?",
        answer: "Yes, you can pause or skip deliveries anytime from your account dashboard. Just make sure to update your preferences before the next shipment is processed.",
    },
    {
        question: "Are add-ons included?",
        answer: "Add-ons are not included by default, but you can purchase extra items or upgrade your kit during checkout or from your account.",
    },
    {
        question: "What if I want more than 3 holidays per year?",
        answer: "You can upgrade your plan or purchase additional kits individually if you want to enjoy more than three hobbies per year.",
    },
];

export default function FAQsPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-8 md:space-y-10 lg:space-y-12 relative">
                <SectionHeader
                    title={
                        <>
                            Got any questions? We&apos;ve <br className="hidden sm:block" /> Got answers
                        </>
                    }
                    subtitle="Frequently Asked Questions"
                />

                <Accordion>
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={index.toString()}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
