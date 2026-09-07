#!/usr/bin/env python3
"""
================================================================================
🦅 PHOENIX AUTONOMOUS BROWSER AGENT & DEEP QA REBUILDING AUDITOR
================================================================================
Role: Autonomous User Simulator, Full-Site Crawler, QA Auditor & Report Engine.
Given any website link, this tool:
  1. Launches Chromium (headless or visible).
  2. Plays as a real user: traverses links, fills inputs, clicks buttons, handles modals.
  3. Captures console logs, runtime errors, network failures (4xx, 5xx), and latency.
  4. Takes full-page screenshots of all explored views.
  5. Computes a comprehensive 0-100 Quality Score across 4 engineering pillars.
  6. Generates a structured AUDIT_REPORT.json and AUDIT_REPORT.md for the rebuilding phase.

Usage:
  python tools/phoenix_auto_auditor.py --url http://localhost:5000/
  python tools/phoenix_auto_auditor.py --url http://localhost:5000/ --max-pages 15 --headful
================================================================================
"""

import argparse
import json
import os
import re
import sys
import time
from urllib.parse import urljoin, urlparse

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
except ImportError:
    print("[ERROR] Playwright is not installed.")
    print("Please install via: pip install playwright && playwright install chromium")
    sys.exit(1)


class PhoenixAutoAuditor:
    def __init__(self, start_url, max_pages=10, headless=True, out_dir="./audit_report", interact=True):
        self.start_url = start_url
        self.max_pages = max_pages
        self.headless = headless
        self.out_dir = out_dir
        self.interact = interact
        self.screenshots_dir = os.path.join(out_dir, "screenshots")
        os.makedirs(self.screenshots_dir, exist_ok=True)

        parsed = urlparse(start_url)
        self.base_domain = parsed.netloc

        self.visited_urls = set()
        self.queue = [start_url]
        self.page_records = []
        self.all_console_errors = []
        self.all_network_errors = []

    def run(self):
        print("=" * 75)
        print("🦅 PHOENIX AUTONOMOUS BROWSER AGENT & QA AUDITOR")
        print(f"Target URL:       {self.start_url}")
        print(f"Max Pages:        {self.max_pages}")
        print(f"Browser Mode:     {'Headless' if self.headless else 'Visible (Headful)'}")
        print(f"Output Directory: {self.out_dir}")
        print("=" * 75)

        start_time = time.time()

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=self.headless)
            context = browser.new_context(
                viewport={"width": 1440, "height": 900},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) PhoenixAutoAuditor/2.0"
            )

            # Auto-handle JS dialog alerts
            context.on("dialog", lambda dialog: dialog.accept())

            page = context.new_page()

            # Listen to Console & Network
            page.on("console", self._handle_console)
            page.on("response", self._handle_response)

            while self.queue and len(self.visited_urls) < self.max_pages:
                current_url = self.queue.pop(0)
                if current_url in self.visited_urls:
                    continue

                self.visited_urls.add(current_url)
                self._audit_single_page(page, current_url)

            browser.close()

        total_duration = time.time() - start_time
        report = self._synthesize_report(total_duration)
        self._write_reports(report)
        self._print_terminal_summary(report)
        return report

    def _handle_console(self, msg):
        if msg.type in ['error', 'warning']:
            self.all_console_errors.append({
                "type": msg.type.upper(),
                "text": msg.text,
                "location": msg.location
            })

    def _handle_response(self, response):
        if response.status >= 400:
            self.all_network_errors.append({
                "url": response.url,
                "status": response.status,
                "statusText": response.status_text
            })

    def _audit_single_page(self, page, url):
        idx = len(self.visited_urls)
        print(f"\n[{idx}/{self.max_pages}] Exploring: {url}")

        page_record = {
            "index": idx,
            "url": url,
            "title": "",
            "load_time_ms": 0,
            "elements": {},
            "interactions_executed": [],
            "discovered_links": [],
            "errors": [],
            "screenshot": ""
        }

        try:
            t0 = time.time()
            res = page.goto(url, wait_until="networkidle", timeout=30000)
            page_record["load_time_ms"] = round((time.time() - t0) * 1000)
            page_record["status_code"] = res.status if res else 200
            page_record["title"] = page.title()
        except Exception as e:
            print(f"  ⚠️ Page Navigation Warning: {e}")
            page_record["errors"].append(str(e))
            self.page_records.append(page_record)
            return

        # Capture interactive elements count
        inputs = page.locator("input, textarea, select")
        buttons = page.locator("button, a.btn, input[type='submit']")
        links = page.locator("a[href]")

        page_record["elements"] = {
            "inputs_count": inputs.count(),
            "buttons_count": buttons.count(),
            "links_count": links.count()
        }

        print(f"  -> Title: \"{page_record['title']}\" ({page_record['load_time_ms']}ms)")
        print(f"  -> Detected: {inputs.count()} inputs, {buttons.count()} buttons, {links.count()} links")

        # Discover internal links to crawl
        try:
            raw_hrefs = page.evaluate("""() => Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'))""")
            for href in raw_hrefs:
                if not href or href.startswith('#') or href.startswith('javascript:'):
                    continue
                full_url = urljoin(url, href).split('#')[0]
                parsed = urlparse(full_url)
                if parsed.netloc == self.base_domain and full_url not in self.visited_urls:
                    if full_url not in self.queue and len(self.queue) < self.max_pages * 2:
                        self.queue.append(full_url)
                        page_record["discovered_links"].append(full_url)
        except Exception as e:
            pass

        # Simulate User Interactions (Forms, Inputs, Taps)
        if self.interact:
            self._simulate_user_behavior(page, page_record)

        # Capture screenshot
        safe_name = re.sub(r'[^a-zA-Z0-9]', '_', url.replace('http://', '').replace('https://', ''))[:45]
        shot_filename = f"page_{idx}_{safe_name}.png"
        shot_path = os.path.join(self.screenshots_dir, shot_filename)
        try:
            page.screenshot(path=shot_path, full_page=True)
            page_record["screenshot"] = shot_filename
            print(f"  📸 Captured view: {shot_filename}")
        except Exception as e:
            page_record["errors"].append(f"Screenshot failed: {e}")

        self.page_records.append(page_record)

    def _simulate_user_behavior(self, page, record):
        """Intelligently simulates a real user entering data and interacting."""
        try:
            # 1. Fill Text Inputs
            text_inputs = page.locator("input[type='text'], input:not([type]), input[type='email'], input[type='password'], textarea")
            count = min(text_inputs.count(), 8)
            for i in range(count):
                inp = text_inputs.nth(i)
                if inp.is_visible() and inp.is_editable():
                    placeholder = (inp.get_attribute("placeholder") or "").lower()
                    name = (inp.get_attribute("name") or "").lower()
                    inp_type = (inp.get_attribute("type") or "").lower()

                    val = "Phoenix Test Data"
                    if "email" in placeholder or "email" in name or inp_type == "email":
                        val = "candidate_audit@phoenix.os"
                    elif "password" in placeholder or "password" in name or inp_type == "password":
                        val = "VentureCapital2026!"
                    elif "name" in placeholder or "name" in name:
                        val = "Alex Candidate"
                    elif "search" in placeholder or "query" in name:
                        val = "Sliding Window"

                    inp.fill(val)
                    record["interactions_executed"].append(f"Filled input [{name or placeholder or i}] with test value")

            # 2. Select Dropdowns
            selects = page.locator("select")
            for i in range(min(selects.count(), 3)):
                sel = selects.nth(i)
                if sel.is_visible():
                    options = sel.locator("option")
                    if options.count() > 1:
                        opt_val = options.nth(1).get_attribute("value")
                        if opt_val:
                            sel.select_option(opt_val)
                            record["interactions_executed"].append(f"Selected option [{opt_val}] on dropdown #{i+1}")

            # 3. Click Primary Buttons / Action Buttons (Skip logout/delete)
            buttons = page.locator("button:not([disabled]), .btn:not([disabled])")
            for i in range(min(buttons.count(), 4)):
                btn = buttons.nth(i)
                if btn.is_visible():
                    btn_text = (btn.inner_text() or "").strip().lower()
                    if any(bad in btn_text for bad in ['logout', 'delete', 'remove', 'sign out']):
                        continue
                    try:
                        btn.click(timeout=1500)
                        time.sleep(0.3)
                        record["interactions_executed"].append(f"Clicked action button: '{btn_text[:30]}'")
                    except Exception:
                        pass
        except Exception as e:
            record["errors"].append(f"Interaction simulation note: {e}")

    def _synthesize_report(self, duration_sec):
        total_pages = len(self.page_records)
        fatal_errors = [e for e in self.all_console_errors if e['type'] == 'ERROR']
        warn_errors = [e for e in self.all_console_errors if e['type'] == 'WARNING']
        http_failures = self.all_network_errors

        # Pillar Quality Scores (0-25 each)
        # 1. Visual & Navigation Health
        nav_score = 25 if total_pages >= 3 else (total_pages * 8)

        # 2. Console & JS Runtime Stability
        console_penalty = min(25, len(fatal_errors) * 5 + len(warn_errors) * 1)
        stability_score = max(0, 25 - console_penalty)

        # 3. Network & API Reliability
        net_penalty = min(25, len(http_failures) * 6)
        network_score = max(0, 25 - net_penalty)

        # 4. Form & User Interaction Completeness
        total_interactions = sum(len(r.get("interactions_executed", [])) for r in self.page_records)
        interaction_score = min(25, 10 + total_interactions * 3)

        composite_score = nav_score + stability_score + network_score + interaction_score

        grade = "A+ (Venture Ready)" if composite_score >= 90 else (
            "A (High Quality)" if composite_score >= 80 else (
                "B (Functional with Loopholes)" if composite_score >= 65 else "C (Needs Hardening)"
            )
        )

        loopholes = []
        if fatal_errors:
            loopholes.append(f"Found {len(fatal_errors)} fatal JS console errors that may disrupt user journey.")
        if http_failures:
            loopholes.append(f"Found {len(http_failures)} HTTP 4xx/5xx network failures during autonomous browsing.")
        if any(r["load_time_ms"] > 2500 for r in self.page_records):
            loopholes.append("One or more pages experienced load latency > 2.5s.")

        actionable_tasks = []
        if http_failures:
            actionable_tasks.append("Audit server route mounts in server.js to resolve broken HTTP endpoints.")
        if fatal_errors:
            actionable_tasks.append("Resolve client-side JavaScript null references in console error logs.")
        actionable_tasks.append("Proceed with high-depth feature-by-feature construction as outlined in the Master Ledger.")

        return {
            "summary": {
                "start_url": self.start_url,
                "pages_explored": total_pages,
                "total_duration_seconds": round(duration_sec, 2),
                "composite_quality_score": composite_score,
                "grade": grade,
                "score_breakdown": {
                    "navigation_health": f"{nav_score}/25",
                    "runtime_stability": f"{stability_score}/25",
                    "network_reliability": f"{network_score}/25",
                    "interaction_completeness": f"{interaction_score}/25"
                }
            },
            "pages": self.page_records,
            "loopholes_detected": loopholes,
            "actionable_rebuilding_tasks": actionable_tasks,
            "network_errors": http_failures,
            "console_errors": self.all_console_errors
        }

    def _write_reports(self, report):
        # 1. JSON Report
        json_path = os.path.join(self.out_dir, "AUDIT_REPORT.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        # 2. Markdown Report
        md_path = os.path.join(self.out_dir, "AUDIT_REPORT.md")
        summary = report["summary"]
        sb = summary["score_breakdown"]

        md_content = f"""# 🦅 Phoenix Autonomous QA & User-Flow Audit Report
**Generated by Phoenix Auto Auditor • Silicon Valley Venture Standard**

## 1. Executive Quality Scorecard
| Metric | Value |
| :--- | :--- |
| **Target Website** | `{summary['start_url']}` |
| **Pages Explored** | `{summary['pages_explored']}` |
| **Exploration Time** | `{summary['total_duration_seconds']}s` |
| **Composite Quality Score** | **{summary['composite_quality_score']} / 100** |
| **Venture Grade** | **{summary['grade']}** |

### Detailed Pillar Breakdown
- 🧭 **Navigation & Visual Flow**: `{sb['navigation_health']}`
- ⚡ **Runtime & Console Stability**: `{sb['runtime_stability']}`
- 🌐 **Network & API Reliability**: `{sb['network_reliability']}`
- 🖱️ **Form & Interaction Completeness**: `{sb['interaction_completeness']}`

---

## 2. Pages Explored & User Journey Log
| # | Page URL | Title | Load Time | Inputs / Buttons | Screenshot |
| :-: | :--- | :--- | :-: | :-: | :--- |
"""
        for p in report["pages"]:
            md_content += f"| {p['index']} | `{p['url']}` | {p['title']} | {p['load_time_ms']}ms | {p['elements'].get('inputs_count', 0)} in / {p['elements'].get('buttons_count', 0)} btn | `{p.get('screenshot', 'none')}` |\n"

        md_content += "\n---\n\n## 3. Detected Loopholes & Vulnerabilities\n"
        if report["loopholes_detected"]:
            for loop in report["loopholes_detected"]:
                md_content += f"- ⚠️ **{loop}**\n"
        else:
            md_content += "- ✅ **Zero critical loopholes detected across explored routes.**\n"

        md_content += "\n---\n\n## 4. Actionable Rebuilding Tasks for Next Agent\n"
        for task in report["actionable_rebuilding_tasks"]:
            md_content += f"1. [ ] {task}\n"

        if report["network_errors"]:
            md_content += "\n---\n\n## 5. Network & API Error Details\n```json\n" + json.dumps(report["network_errors"], indent=2) + "\n```\n"

        if report["console_errors"]:
            md_content += "\n---\n\n## 6. Console Error & Warning Details\n```json\n" + json.dumps(report["console_errors"], indent=2) + "\n```\n"

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(md_content)

        print(f"\n✅ Audit reports written to:\n   - JSON: {json_path}\n   - Markdown: {md_path}")

    def _print_terminal_summary(self, report):
        s = report["summary"]
        print("\n" + "=" * 75)
        print("🏆 AUTONOMOUS AUDIT COMPLETED SUCCESSFULLY!")
        print(f"Composite Score: {s['composite_quality_score']}/100 ({s['grade']})")
        print(f"Pages Explored:  {s['pages_explored']}")
        print(f"Loopholes Found: {len(report['loopholes_detected'])}")
        print(f"Action Tasks:    {len(report['actionable_rebuilding_tasks'])}")
        print("=" * 75)


def main():
    parser = argparse.ArgumentParser(description="Phoenix Autonomous Browser Agent & QA Auditor")
    parser.add_argument("--url", default="http://localhost:5000/", help="Target URL to audit")
    parser.add_argument("--max-pages", type=int, default=8, help="Maximum pages to explore")
    parser.add_argument("--headful", action="store_true", help="Launch visible browser instead of headless")
    parser.add_argument("--out-dir", default="./audit_report", help="Directory for reports and screenshots")
    parser.add_argument("--no-interact", action="store_true", help="Disable automatic form filling & clicks")

    args = parser.parse_args()

    auditor = PhoenixAutoAuditor(
        start_url=args.url,
        max_pages=args.max_pages,
        headless=not args.headful,
        out_dir=args.out_dir,
        interact=not args.no_interact
    )
    auditor.run()


if __name__ == "__main__":
    main()
