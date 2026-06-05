# Football Matching and Scheduling Optimization

Local CS117 Computational Thinking demo for showing the full optimization pipeline:

```text
Input Data -> Compatibility Graph Construction -> Match Scoring -> Feasible Edge Filtering
-> Matching Optimization -> Scheduling Optimization -> Evaluation -> Visualization
```

## Run Locally

```bash
npm install
npm run dev
```

Open the Vite URL, usually:

```text
http://127.0.0.1:5173
```

Production build:

```bash
npm run build
```

## File Structure

```text
src/
  algorithms/
    buildGraph.ts
    greedyMatching.ts
    localSearch.ts
    metrics.ts
    scenarioGenerator.ts
    scheduling.ts
  components/
    ComparisonChart.tsx
    CourtSlotTable.tsx
    EdgeTable.tsx
    GraphStatsCards.tsx
    Header.tsx
    InputConfigPanel.tsx
    MetricsCards.tsx
    ParameterPanel.tsx
    ParetoChart.tsx
    PipelineView.tsx
    ScheduleTable.tsx
    TeamTable.tsx
  data/
    sampleData.ts
  types/
    index.ts
  utils/
    format.ts
  App.tsx
  main.tsx
```

## Algorithms

1. Compatibility graph: every team is a vertex. An undirected edge is created when two teams share at least one available slot, share at least one acceptable court, and their skill gap is at most `maxSkillGap`.
2. Match scoring: each edge estimates profit as `max feasible rental fee + matching fee`. Score is `estimatedProfit - lambda * skillGap`.
3. Greedy matching: feasible edges are sorted by score descending. An edge is selected only when both teams are unused.
4. Local search: starts from the greedy solution and attempts improving two-edge replacements while preserving the one-match-per-team constraint.
5. Scheduling: each selected match is assigned exactly one feasible court-slot pair. Used court-slot pairs cannot be reused, and the available court-slot with the highest rental fee is chosen. Final profit is `rentalFee + matchingFee`.
6. Evaluation: computes total profit, total skill gap, average skill gap, match rate, court utilization, runtime, and match count.

## Demo Controls

- Team sizes: 20, 40, 60, 80, 100
- Court sizes: 2, 3, 4, 5
- Periods: one day with 6 slots, one week with 42 slots
- Scenarios: Normal Demand, High Demand, Limited Availability, Strict Skill Matching, Profit-Oriented, Fairness-Oriented
- Parameters: lambda, max skill gap, matching fee

## Known Limitations

- This is a frontend-only MVP, not an exact maximum-weight matching solver.
- Local search uses a focused two-edge replacement heuristic.
- Generated datasets are deterministic synthetic data for classroom demonstration.
- No backend, database, authentication, persistence, cancellations, weather, or live court availability.

## Future Improvements

- Add CSV import/export for full datasets and schedules.
- Add unit tests for each algorithm module.
- Add exact matching optimization for smaller instances and compare it with heuristics.
- Add richer graph visualization for selected components and rejected edges.
- Add schedule conflict heatmaps by court and time slot.
