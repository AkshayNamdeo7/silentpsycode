interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      {eyebrow ? (
        <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
