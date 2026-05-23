from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
CONFIG = json.loads((SRC / "config.json").read_text(encoding="utf-8"))

def load(path):
    return path.read_text(encoding="utf-8")

def save(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

def rel_prefix(output_path: str) -> str:
    depth = len(Path(output_path).parts) - 1
    return "../" * depth

def resolve_href(href: str, output_path: str) -> str:
    prefix = rel_prefix(output_path)
    if href.startswith("http") or href.startswith("#") or href.startswith("mailto:"):
        return href
    return prefix + href

def render_partial(name: str, context: dict) -> str:
    text = load(SRC / "partials" / name)
    for key, value in context.items():
        text = text.replace("{{" + key + "}}", str(value))
    return text

def render_nav(page: dict) -> str:
    output = page["output"]
    prefix = rel_prefix(output)
    desktop = []
    mobile = []
    for item in CONFIG["nav"]:
        href = resolve_href(item["href"], output)
        current = item["id"] == page["id"]
        attr = ' aria-current="page"' if current else ''
        cls = ' class="is-active"' if current else ''
        desktop.append(f'      <a href="{href}"{cls}{attr}>{item["label"]}</a>')
        mobile.append(f'            <a href="{href}"{cls}{attr} data-menu-link>{item["label"]}</a>')
    context = {
        **CONFIG["site"],
        "home_href": resolve_href("index.html", output),
        "contact_href": resolve_href("index.html#contact", output),
        "desktop_links": "\n".join(desktop),
        "mobile_links": "\n".join(mobile),
    }
    return render_partial("nav.html", context)

def normalize_content(content: str) -> str:
    """Allow src/pages to be either fragments or accidental full HTML documents.
    If a full document is provided, keep only page body content and remove duplicated header/footer.
    """
    low = content.lower()
    if "<!doctype" not in low and "<html" not in low and "<body" not in low:
        return content
    import re
    match = re.search(r"</header>\s*(.*?)\s*<footer\b", content, flags=re.S | re.I)
    if match:
        return match.group(1).strip() + "\n"
    match = re.search(r"<body[^>]*>(.*?)</body>", content, flags=re.S | re.I)
    if match:
        return match.group(1).strip() + "\n"
    return content

def render_page(page: dict):
    output = page["output"]
    prefix = rel_prefix(output)
    site_url = CONFIG["site"].get("site_url", "")
    context = {
        **CONFIG["site"],
        "title": page["title"],
        "description": page["description"],
        "body_class": page.get("body_class", ""),
        "asset_prefix": prefix,
        "home_href": resolve_href("index.html", output),
        "canonical_url": f"{site_url}/{output}",
        "og_image": page.get("og_image", CONFIG["site"].get("og_image", "")),
    }
    content = normalize_content(load(SRC / "pages" / page["source"]))
    html = load(SRC / "templates" / "base.html")
    parts = {
        "head": render_partial("head.html", context),
        "nav": render_nav(page),
        "content": content,
        "footer": render_partial("footer.html", {**context, **CONFIG["site"]}),
        "scripts": render_partial("scripts.html", context),
        "body_class": context["body_class"],
    }
    for key, value in parts.items():
        html = html.replace("{{" + key + "}}", value)
    save(ROOT / output, html)

def build_subdir_pages():
    """Scan src/pages/*/ subdirectories and build each HTML file found."""
    pages_src = SRC / "pages"
    built = 0
    for subdir in sorted(pages_src.iterdir()):
        if not subdir.is_dir():
            continue
        for html_file in sorted(subdir.glob("*.html")):
            rel_source = f"{subdir.name}/{html_file.name}"
            output = f"pages/{subdir.name}/{html_file.name}"
            page = {
                "id": f"{subdir.name}-{html_file.stem}",
                "title": f"TBD Studio | {html_file.stem.replace('-', ' ').title()}",
                "description": "",
                "source": rel_source,
                "output": output,
                "body_class": "sub-page",
            }
            render_page(page)
            built += 1
    return built


def generate_sitemap():
    """Generate sitemap.xml from config pages + subdirectory pages."""
    from datetime import date
    site_url = CONFIG["site"].get("site_url", "").rstrip("/")
    today = date.today().isoformat()
    urls = []
    for page in CONFIG["pages"]:
        output = page["output"]
        loc = f"{site_url}/{output}"
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>")
    pages_dir = ROOT / "pages"
    for subpage in sorted(pages_dir.glob("*/*.html")):
        rel = subpage.relative_to(ROOT).as_posix()
        loc = f"{site_url}/{rel}"
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>")
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "\n".join(urls)
    xml += "\n</urlset>\n"
    save(ROOT / "sitemap.xml", xml)
    print(f"Generated sitemap.xml with {len(urls)} URLs.")


def check_descriptions():
    """Warn if any config page is missing a description."""
    warnings = 0
    for page in CONFIG["pages"]:
        if not page.get("description", "").strip():
            print(f"[WARN] missing description: {page['output']}")
            warnings += 1
    return warnings


def check_broken_links():
    """Warn about internal hrefs that point to non-existent files."""
    import re
    pattern = re.compile(r'href="([^"#?]+)"')
    skip_prefixes = ("http", "mailto:", "tel:", "//", "#")
    warnings = 0
    for html_file in sorted(ROOT.glob("pages/**/*.html")) + [ROOT / "index.html"]:
        if not html_file.exists():
            continue
        content = html_file.read_text(encoding="utf-8")
        for href in pattern.findall(content):
            if any(href.startswith(p) for p in skip_prefixes):
                continue
            target = (html_file.parent / href).resolve()
            if not target.exists():
                print(f"[WARN] broken link in {html_file.relative_to(ROOT)}: {href}")
                warnings += 1
    return warnings


def main():
    for page in CONFIG["pages"]:
        render_page(page)
    print(f"Built {len(CONFIG['pages'])} pages.")

    sub_built = build_subdir_pages()
    if sub_built:
        print(f"Built {sub_built} subdir pages.")

    generate_sitemap()

    warn_count = check_descriptions() + check_broken_links()
    if warn_count:
        print(f"{warn_count} warning(s) found.")
    else:
        print("All checks passed.")

if __name__ == "__main__":
    main()
