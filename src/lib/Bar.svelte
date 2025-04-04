<script>
	import * as d3 from 'd3';

	export let data = [];
	export let width = 400;
	export let barHeight = 30;

	let selectedIndex = -1;
	let hoveredIndex = -1;

	const MIN_LABEL_WIDTH = 40; // Minimum width to place label inside

	// Direct mapping from flatRollup-like data: [label, count]
	$: barData = data.map(([label, count]) => ({ label, count }));

	// X scale for bar length
	$: xScale = d3.scaleLinear()
			.domain([0, d3.max(barData, d => d.count) || 1]) // Avoid empty data crash
			.range([0, width]);

	// Color scale for bar colors
	$: colorScale = d3.scaleOrdinal()
			.domain(barData.map(d => d.label))
			.range(d3.schemeTableau10);
			
	function toggleSelection(i) {
		selectedIndex = selectedIndex === i ? -1 : i;
	}
</script>

<div class="container">
	<svg viewBox="0 0 {width} {barHeight * barData.length}">
		{#each barData as d, i (d.label)}
			<rect
					class:selected={selectedIndex === i}
					class:hovered={hoveredIndex === i}
					x="0"
					y={i * barHeight}
					width={xScale(d.count)}
					height={barHeight - 5}
					fill={colorScale(d.label)}
					on:click={() => toggleSelection(i)}
					on:keydown={e => e.key === 'Enter' && toggleSelection(i)}
					on:mouseenter={() => hoveredIndex = i}
					on:mouseleave={() => hoveredIndex = -1}
					tabindex="0"
					role="button"
					aria-pressed={selectedIndex === i}
					aria-label={`${d.label}: ${d.count}`}
			/>
			<text
					class="label"
					x={xScale(d.count) > MIN_LABEL_WIDTH ? xScale(d.count) - 5 : xScale(d.count) + 5}
					y={i * barHeight + (barHeight - 5) / 2}
					text-anchor={xScale(d.count) > MIN_LABEL_WIDTH ? "end" : "start"}
					fill={xScale(d.count) > MIN_LABEL_WIDTH ? "white" : "#000"}
			>
				{d.label}: {d.count}
			</text>
		{/each}
	</svg>

	<ul class="legend">
		{#each barData as d, i}
			<li>
				<button
					class="legend-button"
					class:selected={selectedIndex === i}
					style="--color: {colorScale(d.label)}"
					on:click={() => toggleSelection(i)}
					aria-pressed={selectedIndex === i}
				>
					<span class="swatch"></span>
					{d.label} <em>({d.count})</em>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	/* ---------- Container Layout ---------- */
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: white;
		color: #000;
		border-radius: 5px;
		padding: 1rem;
		box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	}

	svg {
		background-color: white;
		color: #000;
	}

	svg text {
		fill: #000;
	}

	svg line, svg path {
		stroke: #333;
	}

	/* ---------- Bars ---------- */
	rect {
		transition: all 300ms ease;
		cursor: pointer;
		stroke: #444;
	}

	/* Hover effect */
	rect.hovered {
		opacity: 1;
		stroke: #000;
		stroke-width: 2;
	}

	/* Dim others when hovering */
	svg:has(rect.hovered) rect:not(.hovered) {
		opacity: 0.3;
	}

	/* Selection effect */
	rect.selected {
		stroke: #000;
		stroke-width: 2;
	}

	/* Dim others when selected */
	svg:has(rect.selected) rect:not(.selected) {
		opacity: 0.3;
	}

	/* Combined hover + select */
	rect.selected.hovered {
		stroke: #000;
		stroke-width: 3;
		opacity: 1;
	}

	/* ---------- Labels ---------- */
	.label {
		font-size: 0.75em;
		pointer-events: none;
		dominant-baseline: middle;
		/* Fill is dynamically set */
	}

	/* ---------- Legend ---------- */
	.legend {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
		gap: 0.5em;
		list-style: none;
		padding: 1em;
		margin: 1em 0;
		border: 1px solid #444;
		background: white;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
		color: #000;
	}

	/* Legend items */
	.legend-button {
		color: var(--color);
		cursor: pointer;
		font-size: 0.85em;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		font-family: inherit;
		width: 100%;
	}

	/* Highlight selected */
	.legend-button.selected {
		font-weight: bold;
	}

	/* Dim unselected when one selected */
	.legend:has(.selected) .legend-button:not(.selected) {
		color: #666;
		opacity: 0.5;
	}

	/* Swatch */
	.swatch {
		background: var(--color);
		display: inline-block;
		width: 1em;
		height: 1em;
		border-radius: 0.2em;
		margin-right: 0.25em;
	}

	/* Count formatting */
	.legend em {
		font-style: normal;
		color: gray;
	}
</style>
