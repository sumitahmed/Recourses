"use client";
import "./dbms.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronRight, Folder, FolderOpen, X, FileText } from "lucide-react";
import searchIndexData from "@/lib/dbms-search-index.json";
import navigationData from "@/lib/dbms-navigation.json";

interface Lesson {
  title: string;
  slug: string;
  moduleSlug: string;
  url: string;
  num: number;
  lessonNum: number;
}

interface Module {
  title: string;
  slug: string;
  order: number;
  lessons: Lesson[];
}

const navigation = navigationData as Module[];

interface SearchResult {
  title: string;
  module: string;
  url: string;
  headings: string[];
  snippet: string;
}

const searchIndex = searchIndexData as SearchResult[];

export default function DBMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const currentModule = navigation.find(m =>
      m.lessons.some(l => pathname.includes(l.slug))
    );
    if (currentModule) {
      setOpenModules(prev => ({ ...prev, [currentModule.slug]: true }));
    }
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleModule = (slug: string) => {
    setOpenModules(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const filteredResults = searchQuery.length >= 2
    ? searchIndex.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.module.toLowerCase().includes(q) ||
          item.headings.some((h: string) => h.toLowerCase().includes(q)) ||
          item.snippet.toLowerCase().includes(q)
        );
      }).slice(0, 12)
    : [];

  const SidebarContent = () => (
    <>
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "6px", background: "#EA763F",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "12px", fontWeight: "700"
          }}>
            DB
          </div>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0" }}>DBMS Course</span>
        </div>
      </div>

      <div className="sidebar-search">
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#64748b" }} />
          <input
            placeholder="Search..."
            onClick={() => setSearchOpen(true)}
            readOnly
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          background: "var(--bg2)",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#e2e8f0",
          border: "1px solid var(--border)"
        }}>
          DBMS Modules
        </div>
      </div>

      <nav className="sidebar-nav premium-scrollbar">
        {navigation.map(mod => {
          const isOpen = !!openModules[mod.slug];
          const hasActive = mod.lessons.some(l => pathname.includes(l.slug));

          return (
            <div key={mod.slug}>
              <div
                className={`module-header ${hasActive ? "active" : ""}`}
                onClick={() => toggleModule(mod.slug)}
              >
                <ChevronRight className={`module-chevron ${isOpen ? "open" : ""}`} />
                {isOpen
                  ? <FolderOpen style={{ width: "13px", height: "13px", color: "#EA763F", flexShrink: 0 }} />
                  : <Folder style={{ width: "13px", height: "13px", flexShrink: 0 }} />
                }
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {mod.title}
                </span>
              </div>

              {isOpen && (
                <div className="lesson-list">
                  {mod.lessons.map(lesson => {
                    const isActive = pathname.includes(lesson.slug);
                    return (
                      <Link
                        key={lesson.slug}
                        // Adjust URL to match the new nested structure
                        href={`/resources/dbms/${lesson.moduleSlug}/${lesson.slug}`}
                        className={`lesson-item ${isActive ? "active" : ""}`}
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        <div className={`lesson-radio ${isActive ? "active" : ""}`} />
                        <span>{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="dbms-course-layout bg-[#0e1117] text-slate-200">
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {mobileSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <aside className="sidebar mobile-open" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} />
        </div>
      )}

      <div className="main-content">
        <div className="mobile-header">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0" }}>DBMS Course</span>
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
          >
            <Search style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {children}
      </div>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-input-row">
              <Search style={{ width: "16px", height: "16px", color: "#EA763F", flexShrink: 0 }} />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search lessons, topics, SQL..."
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            {filteredResults.length > 0 && (
              <div className="search-results content-scrollbar">
                {filteredResults.map(item => {
                  const urlParts = item.url.split('/');
                  const lslug = urlParts[urlParts.length-1];
                  const mslug = urlParts[urlParts.length-2];
                  return (
                    <Link
                      key={item.url}
                      href={`/resources/dbms/${mslug}/${lslug}`}
                      className="search-result-item"
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      style={{ display: "block", textDecoration: "none" }}
                    >
                      <div className="search-result-title">
                        <FileText style={{ width: "13px", height: "13px", color: "#EA763F", flexShrink: 0 }} />
                        {item.title}
                        <span className="search-result-module">{item.module}</span>
                      </div>
                      <div className="search-result-snippet">{item.snippet}</div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
