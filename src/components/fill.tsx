import { Fragment, type ReactNode } from "react";

// A line from the copy files with a link inside it (#561): "Email {email} and
// we'll reply". Each {key} is replaced by its element; the words around it stay
// editable in the copy file. An unknown {key} is left as written, so a typo shows
// on the preview instead of vanishing.
export function fill(text: string, parts: Record<string, ReactNode>): ReactNode {
  return text.split(/(\{[a-z]+\})/).map((bit, i) => {
    const key = bit.match(/^\{([a-z]+)\}$/)?.[1];
    return <Fragment key={i}>{key && key in parts ? parts[key] : bit}</Fragment>;
  });
}
