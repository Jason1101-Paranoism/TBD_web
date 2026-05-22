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

def main():
    for page in CONFIG["pages"]:
        render_page(page)
    print(f"Built {len(CONFIG['pages'])} pages.")

if __name__ == "__main__":
    main()
