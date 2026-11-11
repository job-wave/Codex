# JOBWAVE service ownership

Before adding a feature or homepage card, compare its user goal, input, output, and saved state with this map. Report overlap to the owner before creating another screen. A different entry point should link to the canonical screen.

- `/practice#essay`: the only writing editor, experience organizer and AI essay coaching screen. Legacy `showView('essay')` routes through `service-bridge.js`; selected job and unsaved text are offered for explicit import, never silently overwrite the saved draft.
- `/practice#interview`: practice questions, recording, text-answer coaching, and preparatory interview help.
- `/practice#aptitude`, `/practice#ncs`, `/practice#capacity`: original practice exercises. Career self-reflection assessments serve a different purpose.
- Main app `prep`: application documents and submission checklist; portfolio guide. No second writing or interview tool.
- Main app career assessment: self-reflection, with next actions. Plan setup reuses explicit professional experience years; do not infer factual answers from reflection scores.
- Main app career plan: ongoing tasks. `/challenges/{track}` is the introductory first-seven-days course, linked from the plan. Challenge notes remain browser-local; do not imply account synchronization.
- `/guides`: reading library for career decisions. `/stories`: examples linked from the canonical essay guide section.
- `/resources`: external dates, support, opportunities, education, market summaries and work tips.
- `/company`: business areas and dated project references; institutional enquiries route to the existing private consultation inbox under the separate topic `교육·행사 협업`.

Do not invent project results, client roles, partnership claims, metrics, or logos. Reference progress labels are dated snapshots, not live status.
