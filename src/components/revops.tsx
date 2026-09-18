/* Revenue Operations, with the R and the O picked out the way borre.ro does.
   Wrapped so the whole phrase still reads as one word to assistive tech. */
export function RevOps({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span aria-hidden="true">
        <span className="text-action">R</span>evenue <span className="text-action">O</span>
        perations
      </span>
      <span className="sr-only">Revenue Operations</span>
    </span>
  );
}
