# Verification record

Date: 2026-11-17. Environment: Windows; isolated JavaScript execution using the same pure modules and tests, with a JSON-based `structuredClone` substitute.

| Check | Status | Evidence |
| --- | --- | --- |
| Pure rule, content and state tests | Pass with limitation | 35/35 passed in the browser runner served over local HTTP in headless Microsoft Edge. |
| Fresh-start full browser playthrough | Pass (automated) | In headless Edge, tests/night-watch.html used the game controls to submit a wrong repair and six correct repairs, check the online count each time, and reach the daybreak session summary. |
| Keyboard-only, screen reader, narrow viewport and reduced motion | Not run | Requires interactive browser checks and assistive technology. |
| All incident explanations and sources independently reviewed | Not run | The fixtures are documented in `tests/fixtures/expected-cases.md`; independent reviewer and source review still required. |
| First, middle and final unavailable slots in browser | Not run | State tests cover first and final slots; interactive verification and middle slot remain. |
| Trial incident without engine changes | Not run | Requires a trial fixture and result record. |
| Timing, subpath hosting and fresh checkout | Not run | No observed completion time or hosting test recorded. |

The automated browser playthrough covers the wrong-answer, repair, progression and complete-summary path. Passing pure tests does not establish the visual, assistive-technology, end-to-end, or source-review requirements. Structured VLAN and gateway observations are checked for supported values, consistency with the selected fault, and extra mismatches; route incidents must not include another structured mismatch. The validator does not interpret the remaining free-form evidence, prove that all relevant components were modeled, or establish that a fictional path has a unique root cause. That validation and independent review remain required before release.

