# 7일 커리어 챌린지

`/challenges` introduces two self-paced seven-step courses, with public pages at `/challenges/student` and `/challenges/professional`. Fourteen original tasks connect existing guides, missions, stories and plan entry points. Time estimates are 10–15 minutes; no dates, notifications, completion deadlines or career outcomes are promised.

Progress and up to seven 600-character notes per course are stored only in this browser under versioned, track-specific localStorage keys. Nothing is submitted to the server or synchronized with an account. UI states explicitly describe device-only persistence, persistence after sign-out, copying before clearing, and storage failures. Corrupt saved data is preserved until explicit reset. Invalid notes cannot be marked complete; editing a note cancels its completion marker. Other tabs are updated through storage events. Reset uses a review dialog and removes only the current course key. Browser storage can be cleared by the visitor or browser; copying exports the current notes and completion status for separate safekeeping.

The seven-day review uses textContent to show notes, offers clipboard copying with selection fallback, and links to the existing plan flow without sending or implicitly importing notes. Completion is a self-reported task count, not a diagnostic or hiring score.

Discovery: a paired compact homepage link alongside the existing story link, public content navigation, and links from mission and story lists. Existing account, collection and member-state code is unchanged.
