"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookOpen, FileText, Cpu, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Clock } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface LessonInfo {
  title: string;
  slug: string;
  url: string;
  num: number;
}

interface LessonPageClientProps {
  lesson: { title: string; slug: string; url: string; num: number };
  module: { title: string; slug: string };
  contentHtml: string;
  headings: Heading[];
  prev: (LessonInfo & { module?: string }) | null;
  next: (LessonInfo & { module?: string }) | null;
  currentOrder: number;
  totalLessons: number;
}

export function LessonPageClient({
  lesson,
  module: mod,
  contentHtml,
  headings,
  prev,
  next,
  currentOrder,
  totalLessons,
}: LessonPageClientProps) {
  const [activeTab, setActiveTab] = useState<"about" | "notes" | "ai">("about");
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Inject heading IDs into content
  const processedHtml = React.useMemo(() => {
    let html = contentHtml;
    headings.forEach(h => {
      // Add id to matching headings
      html = html.replace(
        new RegExp(`<h${h.level}([^>]*)>\\s*${h.text.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*</h${h.level}>`, 'i'),
        `<h${h.level}$1 id="${h.id}">${h.text}</h${h.level}>`
      );
    });

    // Add copy button and wrapper to pre blocks
    html = html.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (match) => {
      return `<div class="code-block-wrapper">
        <button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText); this.innerText='Copied!'; setTimeout(()=>this.innerText='Copy', 2000)">Copy</button>
        ${match}
      </div>`;
    });

    return html;
  }, [contentHtml, headings]);

  // Scroll spy for TOC
  useEffect(() => {
    if (!panelRef.current) return;
    const panel = panelRef.current;

    const updateProgress = () => {
      const scrollTop = panel.scrollTop;
      const scrollHeight = panel.scrollHeight - panel.clientHeight;
      setReadingProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      // Update active heading
      if (headings.length > 0) {
        let active = headings[0].id;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (el && el.getBoundingClientRect().top < 120) {
            active = h.id;
          }
        }
        setActiveHeading(active);
      }
    };

    panel.addEventListener("scroll", updateProgress, { passive: true });
    return () => panel.removeEventListener("scroll", updateProgress);
  }, [headings]);

  // Word count -> reading time
  const wordCount = contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      {/* Reading Progress Bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 100,
        background: "rgba(234,118,63,0.15)",
      }}>
        <div style={{
          height: "100%",
          width: `${readingProgress}%`,
          background: "linear-gradient(90deg, #EA763F, #f59e0b)",
          transition: "width 0.1s ease",
        }} />
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          <BookOpen className="tab-icon" />
          About
        </button>
        <button
          className={`tab-item ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <FileText className="tab-icon" />
          Notes
        </button>
        <button
          className={`tab-item ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          <Cpu className="tab-icon" />
          AI
        </button>

        <div className="tab-right">
          <div className="theory-toggle">
            <span>Theory View</span>
            <div style={{
              width: "32px", height: "18px", borderRadius: "9px",
              background: "#EA763F", cursor: "pointer", position: "relative",
            }}>
              <div style={{
                position: "absolute", right: "2px", top: "2px",
                width: "14px", height: "14px", borderRadius: "50%",
                background: "white",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Main Content Panel */}
        <div
          ref={panelRef}
          className="content-panel content-scrollbar"
          style={{ flex: 1 }}
        >
          {activeTab === "about" && (
            <div className="lesson-content-wrapper" ref={contentRef}>
              {/* Lesson Meta Header */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", color: "#EA763F",
                    background: "rgba(234,118,63,0.1)", padding: "3px 10px",
                    borderRadius: "99px", border: "1px solid rgba(234,118,63,0.2)",
                    textTransform: "uppercase", letterSpacing: "0.05em"
                  }}>
                    {mod.title}
                  </span>
                  <span style={{ color: "#475569", fontSize: "11px" }}>•</span>
                  <span style={{
                    fontSize: "11px", color: "#64748b",
                    display: "flex", alignItems: "center", gap: "4px"
                  }}>
                    <Clock style={{ width: "11px", height: "11px" }} />
                    {readingTime} min read
                  </span>
                  <span style={{ color: "#475569", fontSize: "11px" }}>•</span>
                  <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                    {currentOrder}/{totalLessons}
                  </span>
                </div>
                <h1 style={{
                  fontSize: "22px", fontWeight: "700", color: "#e2e8f0",
                  lineHeight: "1.3", margin: 0
                }}>
                  {lesson.title}
                </h1>
              </div>

              {/* Extracted HTML Content */}
              {mounted ? (
                <div
                  className="coreSubject"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />
              ) : (
                <div className="coreSubject" />
              )}

              {/* Prev / Next */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "48px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border)"
              }}>
                {prev ? (
                  <Link
                    href={prev.url}
                    style={{
                      padding: "12px 16px", borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--bg2)",
                      textDecoration: "none",
                      display: "flex", flexDirection: "column", gap: "4px",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(234,118,63,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      <ArrowLeft style={{ width: "12px", height: "12px" }} />
                      Previous
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#e2e8f0" }}>
                      {prev.title}
                    </span>
                  </Link>
                ) : <div />}

                {next && (
                  <Link
                    href={next.url}
                    style={{
                      padding: "12px 16px", borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--bg2)",
                      textDecoration: "none",
                      display: "flex", flexDirection: "column", gap: "4px",
                      alignItems: "flex-end",
                      gridColumn: prev ? "2" : "1 / -1",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(234,118,63,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <span style={{ fontSize: "11px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                      Next
                      <ArrowRight style={{ width: "12px", height: "12px" }} />
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#e2e8f0", textAlign: "right" }}>
                      {next.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", gap: "12px" }}>
              <FileText style={{ width: "40px", height: "40px" }} />
              <div style={{ fontSize: "14px" }}>Personal notes coming soon</div>
            </div>
          )}

          {activeTab === "ai" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", gap: "12px" }}>
              <Cpu style={{ width: "40px", height: "40px" }} />
              <div style={{ fontSize: "14px" }}>AI Assistant coming soon</div>
            </div>
          )}
        </div>

        {/* TOC — Right Sidebar */}
        {activeTab === "about" && headings.length > 0 && (
          <div style={{
            width: "200px",
            minWidth: "200px",
            padding: "16px 12px",
            borderLeft: "1px solid var(--border)",
            overflowY: "auto",
            background: "var(--bg)",
            display: "none",
          }}
            className="toc-panel content-scrollbar lg:block"
          >
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
              On This Page
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {headings.filter(h => h.level <= 3).map(h => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    fontSize: "11px",
                    color: activeHeading === h.id ? "#EA763F" : "#64748b",
                    fontWeight: activeHeading === h.id ? "600" : "400",
                    paddingLeft: h.level === 2 ? "0" : h.level === 3 ? "10px" : "20px",
                    padding: "3px 0 3px " + (h.level === 2 ? "0" : h.level === 3 ? "10px" : "20px"),
                    borderLeft: `2px solid ${activeHeading === h.id ? "#EA763F" : "transparent"}`,
                    textDecoration: "none",
                    display: "block",
                    transition: "all 0.15s ease",
                    lineHeight: "1.4",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
