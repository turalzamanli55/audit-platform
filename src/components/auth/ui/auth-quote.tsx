type AuthQuoteProps = {
  quote: string;
  author: string;
};

export function AuthQuote({ quote, author }: AuthQuoteProps) {
  return (
    <figure className="rounded-2xl border border-border/40 bg-muted/20 p-6">
      <blockquote className="text-pretty text-sm leading-relaxed text-foreground sm:text-base">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-xs text-muted-foreground">— {author}</figcaption>
    </figure>
  );
}
