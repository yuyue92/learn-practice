import React, { useMemo, useState } from "react";

/**
 * Highlight text by wrapping matched substrings in a tag (default <mark/>).
 * - Works with 1 string query or an array of queries
 * - Safe RegExp building with autoEscape
 * - Case sensitive toggle
 * - Render-prop override for custom marks
 * - Zero-dep, pure React (non-TS)
 */
export default function Highlighter({
    text = "",
    query = "",
    /** string | string[] */
    queries,
    /** when true, escape regex special chars in query */
    autoEscape = true,
    caseSensitive = false,
    /** HTML tag to wrap highlights */
    markTag = "mark",
    /** class applied to <mark> */
    highlightClassName = "bg-yellow-200 rounded px-0.5",
    /** function(segmentText, idx) => ReactNode for custom rendering of matched parts */
    renderMark,
    /** if true, match whole words only */
    wordBoundary = false,
}) {
    const terms = useMemo(() => {
        const q = queries ?? query;
        const arr = Array.isArray(q)
            ? q.filter(Boolean)
            : (q ? [q] : []);
        return arr.map((s) => s.toString()).filter((s) => s.length > 0);
    }, [query, queries]);

    const regex = useMemo(() => {
        if (!terms.length) return null;
        const escaped = terms.map((t) => (autoEscape ? escapeRegExp(t) : t));
        const body = escaped
            .map((t) => (wordBoundary ? `\\b(${t})\\b` : `(${t})`))
            .join("|");
        try {
            return new RegExp(body, caseSensitive ? "g" : "gi");
        } catch (e) {
            console.warn("Invalid regex from query; falling back to escaped string match.", e);
            const safe = terms.map(escapeRegExp).join("|");
            return new RegExp(wordBoundary ? `\\b(${safe})\\b` : `(${safe})`, caseSensitive ? "g" : "gi");
        }
    }, [terms, autoEscape, caseSensitive, wordBoundary]);

    const parts = useMemo(() => (regex ? splitByRegex(text, regex) : [{ text, match: false }]), [text, regex]);

    if (!regex) return <span>{text}</span>;

    const MarkTag = markTag;
    return (
        <span>
            {parts.map((p, i) =>
                p.match ? (
                    renderMark ? (
                        <React.Fragment key={i}>{renderMark(p.text, i)}</React.Fragment>
                    ) : (
                        <MarkTag key={i} className={highlightClassName}>{p.text}</MarkTag>
                    )
                ) : (
                    <React.Fragment key={i}>{p.text}</React.Fragment>
                )
            )}
        </span>
    );
}

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitByRegex(text, regex) {
    if (!text) return [];
    const out = [];
    let lastIndex = 0;
    let m;
    // reset stateful flags just in case
    regex.lastIndex = 0;
    while ((m = regex.exec(text)) !== null) {
        const start = m.index;
        const end = regex.lastIndex;
        if (start > lastIndex) {
            out.push({ text: text.slice(lastIndex, start), match: false });
        }
        out.push({ text: text.slice(start, end), match: true });
        if (end === lastIndex) regex.lastIndex++; // avoid zero-length loops
        lastIndex = end;
    }
    if (lastIndex < text.length) {
        out.push({ text: text.slice(lastIndex), match: false });
    }
    return out;
}

/**
 * Hook: compute highlight chunks you can use for custom renderers
 */
export function useHighlightChunks({ text, query, queries, autoEscape = true, caseSensitive = false, wordBoundary = false }) {
    const terms = useMemo(() => {
        const q = queries ?? query;
        const arr = Array.isArray(q) ? q.filter(Boolean) : (q ? [q] : []);
        return arr.map((s) => s.toString()).filter((s) => s.length > 0);
    }, [query, queries]);

    const regex = useMemo(() => {
        if (!terms.length) return null;
        const escaped = terms.map((t) => (autoEscape ? escapeRegExp(t) : t));
        const body = escaped
            .map((t) => (wordBoundary ? `\\b(${t})\\b` : `(${t})`))
            .join("|");
        try {
            return new RegExp(body, caseSensitive ? "g" : "gi");
        } catch (e) {
            const safe = terms.map(escapeRegExp).join("|");
            return new RegExp(wordBoundary ? `\\b(${safe})\\b` : `(${safe})`, caseSensitive ? "g" : "gi");
        }
    }, [terms, autoEscape, caseSensitive, wordBoundary]);

    const parts = useMemo(() => (regex ? splitByRegex(text, regex) : [{ text, match: false }]), [text, regex]);
    return parts;
}
