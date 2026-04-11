function StarEmpty({ size = 14 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function StarHalf({ size = 14 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M14.8356 6.73297L15.2401 7.52662C15.3853 7.81154 15.658 8.00982 15.9737 8.06012L20.7286 8.8174C21.5345 8.94575 21.8557 9.9333 21.2794 10.5111L17.8754 13.9242C17.6499 14.1503 17.5459 14.4705 17.5956 14.786L18.3459 19.5494C18.473 20.3561 17.6318 20.9668 16.9042 20.5961L14.76 19.5038"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.737 2.62958C11.2858 1.55262 12.9116 1.94303 12.9116 3.15175V17.5672C12.9116 18.2253 12.5424 18.8278 11.9559 19.1265L7.75942 21.2644C6.48602 21.9131 5.01402 20.8445 5.23637 19.4328L5.98666 14.6693C5.99908 14.5904 5.97309 14.5104 5.91672 14.4538L2.51272 11.0407C1.50424 10.0296 2.06623 8.30134 3.47657 8.07673L8.23145 7.31945C8.3104 7.30688 8.37857 7.2573 8.41487 7.18608L10.737 2.62958Z"
                fill="currentColor"
            />
        </svg>
    );
}

function StarFilled({ size = 14 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.6772 2.9544C11.3321 1.68187 13.1679 1.68187 13.8228 2.9544L16.0293 7.24233C16.0659 7.31348 16.1347 7.363 16.2143 7.37556L21.0106 8.13205C22.4332 8.35643 23.0001 10.0828 21.9828 11.093L18.5492 14.5025C18.4923 14.559 18.4661 14.6389 18.4787 14.7177L19.2355 19.4762C19.4598 20.8865 17.9749 21.9539 16.6905 21.3059L12.3645 19.1234C12.2926 19.0871 12.2074 19.0871 12.1355 19.1234L7.80953 21.3059C6.52505 21.9539 5.04024 20.8865 5.26453 19.4762L6.02134 14.7177C6.03387 14.6389 6.00766 14.559 5.95079 14.5025L2.51718 11.093C1.49993 10.0828 2.06681 8.35643 3.48941 8.13205L8.28567 7.37556C8.3653 7.363 8.43407 7.31348 8.47069 7.24233L10.6772 2.9544Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function StarRating({ rating, size = 14, withText = false }: { rating: number; size?: number; withText?: boolean }) {
    const stars = Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        if (rating >= value) return "full";
        if (rating >= value - 0.5) return "half";
        return "empty";
    });

    return (
        <div className="flex items-center gap-0.5">
            {stars.map((type, i) => (
                <span key={i} style={{ width: size, height: size }} className="inline-flex items-center justify-center text-[#FF7A00]">
                    {type === "full" && <StarFilled size={size} />}
                    {type === "half" && <StarHalf size={size} />}
                    {type === "empty" && <StarEmpty size={size} />}
                </span>
            ))}
            {withText && <span className="ml-1 text-sm text-muted-foreground">{rating}</span>}
        </div>
    );
}
