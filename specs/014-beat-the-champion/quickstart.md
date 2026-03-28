# Quickstart: Beat the Champion (014)

## Prerequisites

1. PySpark export complete — `wca_beat_the_champion.json` generated in `pyspark_sandbox/export/clean/`
2. On branch `014-beat-the-champion`
3. `cfop-app` dev server not running (or restart after data file copy)

---

## Step 1: Copy Data File

```bash
cp pyspark_sandbox/export/clean/wca_beat_the_champion.json \
   cfop-app/public/data/wca-beat-the-champion.json
```

---

## Step 2: Start Dev Server

```bash
cd cfop-app
# Kill any existing Vite processes first:
ps aux | grep -i vite | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true
npm run dev -- --host 127.0.0.1 --port 5173
# URL: http://127.0.0.1:5173/cubing.spec/
```

---

## Step 3: Verify Data Loads

Open browser console and run:
```javascript
fetch('/cubing.spec/data/wca-beat-the-champion.json')
  .then(r => r.text())
  .then(t => console.log(t.split('\n').filter(Boolean).length + ' competitions loaded'))
// Expected: "57 competitions loaded"
```

---

## Implementation Entry Points

| What | Where |
|---|---|
| New types | `cfop-app/src/types/competition.ts` (new) |
| Data loader | `cfop-app/src/utils/competitionData.ts` (new) |
| Modal changes | `cfop-app/src/components/PracticeSessionModal.tsx` |
| Modal styles | `cfop-app/src/components/PracticeSessionModal.css` |
| Competition selector | `cfop-app/src/components/CompetitionSelector.tsx` (new) |
| Comparison result | `cfop-app/src/components/ComparisonResult.tsx` (new) |

---

## Key Invariants to Preserve

- `useSolveStats` / `saveSolve` must **only** be called in standard mode — never for competitive solves
- `CompetitiveSession` state must be `null` when modal is closed (cleared in the `isOpen` effect)
- Competitive mode scrambles come from `session.scrambles[session.currentIndex]` — never from `generateRandom333Scramble()`
- The mode toggle must be disabled while `timer.state === 'running'`
