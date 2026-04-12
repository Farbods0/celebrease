export default function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-8 md:mb-10 lg:mb-12 flex flex-col items-center text-center">
            <p className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-medium mb-3">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold">{title}</h2>
        </div>
    );
}
