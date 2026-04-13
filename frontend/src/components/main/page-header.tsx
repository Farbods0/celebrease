type PageHeaderProps = {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <section
            style={{
                backgroundImage: `url('gradient/section.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 text-center space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold">{title}</h2>
                <p>{description}</p>
            </div>
        </section>
    );
}
