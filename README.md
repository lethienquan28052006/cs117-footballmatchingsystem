# Football Matching & Scheduling Optimization

CS117 Computational Thinking Demo

This is a single-page web app that demonstrates a complete football matchmaking and field scheduling optimization pipeline:

```text
Input teams
-> Build compatibility graph
-> Calculate score
-> Filter edges
-> Greedy matching
-> Local search improvement
-> Assign court/time slot
-> Evaluation
-> Final schedule
```

The app is built as an MVP demo for classroom presentation. It runs fully on the frontend, with no backend, database, authentication, or external API calls.

## Tech Stack

- React
- Vite
- TypeScript
- TailwindCSS
- Recharts
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
src/
  data/
    sampleData.ts
  algorithms/
    buildGraph.ts
    greedyMatching.ts
    localSearch.ts
    scheduling.ts
    metrics.ts
    scenarioGenerator.ts
  components/
    Header.tsx
    TeamTable.tsx
    CourtSlotTable.tsx
    ParameterPanel.tsx
    EdgeTable.tsx
    ScheduleTable.tsx
    MetricsCards.tsx
    ComparisonChart.tsx
    ParetoChart.tsx
    PipelineView.tsx
  types/
    index.ts
  utils/
    format.ts
  App.tsx
  main.tsx
```

## Data Model

The app uses these core entities:

- `Team`: football team profile, skill level, available slots, preferred courts, and payment.
- `CourtSlot`: court-time option with fee and availability.
- `Edge`: compatible pair of teams with common slots, skill gap, estimated profit, and score.
- `ScheduledMatch`: final assigned match with court, time, score, and final profit.

Sample data includes:

- 20 predefined teams.
- 3 courts: `Court 1`, `Court 2`, `Court 3`.
- 6 time slots from Monday to Wednesday.
- Court fees from about 250,000 to 400,000 VND.

The UI can also generate 20-team or 50-team scenarios.

## Parameters

Users can adjust:

- `lambda`: penalty coefficient for skill gap. Default: `0.36`.
- `maxSkillGap`: maximum allowed skill difference. Default: `3`.
- `matchingFee`: service fee charged per team. Default: `50,000 VND`.
- `algorithmMode`: `Greedy only` or `Greedy + Local Search`.

## Algorithms

### 1. Build Compatibility Graph

The app checks every pair of teams. An edge is valid when:

```text
commonSlots.length > 0
abs(skill_i - skill_j) <= maxSkillGap
```

Then it calculates:

```text
estimatedProfit = pay_i + pay_j + 2 * matchingFee
score = estimatedProfit - lambda * skillGap * 100000
```

Only edges with positive score are kept.

### 2. Greedy Matching

Edges are sorted by descending score. The algorithm selects an edge only if both teams are still unmatched.

### 3. Local Search

Starting from the greedy matching, the local search tries to improve the result by replacing two matched edges with two alternative edges. A swap is accepted only if it increases total score and keeps teams unique.

The search stops after 50 iterations or when no improvement is found.

### 4. Scheduling

For each matched pair, the scheduler finds an available court-time slot that appears in the teams' common slots.

It prioritizes courts preferred by both teams, then chooses the cheapest valid court slot.

```text
finalProfit = estimatedProfit - courtFee
```

Matches without a feasible court-time slot are skipped.

### 5. Evaluation Metrics

The dashboard reports:

- Total Profit
- Average Skill Gap
- Match Rate
- Fill Rate
- Runtime
- Total Matches

## Charts

### Greedy vs Local Search

The comparison chart shows:

- Total Profit
- Average Skill Gap
- Total Matches

### Pareto Curve

The Pareto chart runs the pipeline with these lambda values:

```text
[0, 0.1, 0.2, 0.36, 0.5, 0.75, 1.0]
```

It visualizes the trade-off between fairness and profit:

- Smaller lambda usually allows higher profit but larger skill gaps.
- Larger lambda penalizes uneven matches more strongly.

## Demo Flow

1. Review sample teams and court slots.
2. Adjust optimization parameters.
3. Click `Run Optimization`.
4. Inspect compatible edges, final schedule, and metrics.
5. Compare Greedy vs Local Search.
6. Click `Generate Pareto Curve` to explain the profit/fairness trade-off.
7. Try `Generate 50 Teams` to show scalability.

## Validation Notes

The project was checked with:

```bash
npm install
npm run build
```

The algorithm pipeline was also tested with:

- 20 sample teams producing a non-empty schedule.
- 50 generated teams running under 5 seconds.
- Pareto curve producing all 7 lambda scenarios.

## Known Limitations

- This is an MVP frontend demo, not a production optimizer.
- Local search uses a simple 2-edge swap strategy.
- Court availability is static sample data.
- No persistence beyond app state.
- No backend, authentication, upload, payment, map, or real-time multiplayer.

## Suggested Next Steps

- Add editable team and court-slot forms.
- Add CSV import/export for teams and schedules.
- Add more advanced matching algorithms, such as maximum weight matching.
- Add better schedule conflict visualization.
- Add unit tests for each algorithm module.
