# PHOENIX INTERVIEW PREP — AGENT OPERATING DIRECTIVES

## DAILY WORKFLOW — READ THIS EVERY SESSION BEFORE DOING ANYTHING ELSE

You have two reference prompts in this project's `AGENT_PROMPTS/` (and `Agent prompt/`) folder:
- `AGENT_PROMPTS/BUILDER_PROMPT.md` — your default working identity
- `AGENT_PROMPTS/REJECTOR_PROMPT.md` — an independent, adversarial audit pass

Decide today's mode using this order of checks:

1. **CHECK FOR OPEN REJECTIONS FIRST.**
   Look at `REJECTION_REPORT.md` at the project root (if it exists). If it contains any OPEN item marked Critical or Major, today is a **BUILD** day: read and follow `AGENT_PROMPTS/BUILDER_PROMPT.md` in full — its own first step already tells you to prioritize resolving those items before anything else. Stop here; do not also run the Rejector today.

2. **OTHERWISE, CHECK HOW LONG SINCE THE LAST AUDIT.**
   Read `docs/CHANGELOG_DAILY.md` and count how many consecutive entries exist since the last one that mentions a Rejector pass (or count total entries if none has happened yet). If that count has reached 5, today is a **REJECT** day: read and follow `AGENT_PROMPTS/REJECTOR_PROMPT.md` in full, and note in `docs/CHANGELOG_DAILY.md` that today was a Rejector pass so the count resets.

3. **OTHERWISE**, today is a normal **BUILD** day: read and follow `AGENT_PROMPTS/BUILDER_PROMPT.md` in full.

---

## BEFORE ENDING ANY SESSION, REGARDLESS OF MODE:

Look ahead, not just back. In `docs/CHANGELOG_DAILY.md`'s entry for today, add a short **"Looking ahead"** note: 1–3 ideas for features or improvements that are NOT worth doing today (too large, too risky, or lower priority than what you did) but are worth a future session considering. Also fold anything genuinely new into `ROADMAP_AND_FLOW.md`'s forward-looking section, so the project's future direction stays visible and isn't lost between sessions — but do not act on these ideas today; they're for tomorrow's session (or a future Research role pass) to properly evaluate first, not to be implemented on a hunch.

If `AGENT_PROMPTS/BUILDER_PROMPT.md` or `AGENT_PROMPTS/REJECTOR_PROMPT.md` is missing, stop and flag that clearly instead of guessing at what they would have said.
