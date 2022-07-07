import * as React from 'react';

import { Queue } from './queue';

import * as styles from './style.module.css';


const SVG_NS = 'http://www.w3.org/2000/svg';

const OrgChart = (props) => {
	const {
		data,
		render,
		chartId = 'orgchart',
		staffProperty = 'staff',
		idProperty = 'id',
		childrenProperty = 'children',
		strokeStyleProperty = 'strokeStyle',
	} = props;

	const containerRef = React.useRef();
	const svgRef = React.useRef();

	const refreshLines = () => {
		/** @type {HTMLDivElement} */
		const container = containerRef.current;
		/** @type {SVGSVGElement} */
		const svg = svgRef.current;

		const containerRect = container.getBoundingClientRect();

		const paths = [...svg.childNodes];
		const prev = paths.length;
		let idx = 0;

		const queue = new Queue();
		queue.enqueue([null, data]);

		svg.style.width = containerRect.width + 'px';
		svg.style.height = containerRect.height + 'px';

		while (queue.size) {
			const [parentId, node] = queue.dequeue();

			const id = node[idProperty];
			const children = node[childrenProperty];
			const strokeStyle = node[strokeStyleProperty];

			if (children) {
				for (let idx = 0, len = children.length; idx < len; idx++) {
					const child = children[idx];
					queue.enqueue([id, child]);
				}
			}

			if (!parentId) {
				continue;
			}

			const parentEl = container.querySelector(`.${styles.container}[data-id="${chartId}${parentId}"]`);
			const nodeEl = container.querySelector(`.${styles.container}[data-id="${chartId}${id}"]`);

			const parentRect = parentEl.getBoundingClientRect();
			const nodeRect = nodeEl.getBoundingClientRect();

			const parentX = parentRect.left - containerRect.left;
			const parentY = parentRect.top - containerRect.top;

			const nodeX = nodeRect.left - containerRect.left;
			const nodeY = nodeRect.top - containerRect.top;

			const d =
				'M' + (parentX + parentRect.width / 2) +
				' ' + (parentY + parentRect.height) +
				' V' + (nodeY - 16) +
				' H' + (nodeX + nodeRect.width / 2) +
				' V' + nodeY;

			/** @type {SVGPathElement} */
			let pathEl;

			if (idx < prev) {
				pathEl = paths[idx];
			} else {
				pathEl = document.createElementNS(SVG_NS, 'path');
				svg.appendChild(pathEl);
			}

			pathEl.setAttributeNS(null, 'd', d);
			pathEl.style.strokeDasharray = strokeStyle === 'dotted' ? '2px' : '';

			idx++;
		}

		for (; idx < prev; idx++) {
			const excess = paths[idx];
			excess.remove();
		}
	};

	React.useEffect(() => {
		refreshLines();

		const callback = () => requestAnimationFrame(refreshLines);
		window.addEventListener('resize', callback);
		return () => window.removeEventListener('resize', callback);
	});

	const renderNode = (node) => {
		const children = node[childrenProperty] || [];

		const leftAssistants = [];
		const rightAssistants = [];
		const divisions = [];

		let assistantIdx = 0;
		let hasAssistants = false;
		let hasLeftAssistants = false;
		let hasRightAssistants = false;
		let hasDivisions = false;

		for (let idx = 0, len = children.length; idx < len; idx++) {
			const child = children[idx];

			if (child[staffProperty]) {
				if (assistantIdx % 2 === 0) {
					leftAssistants.push(child);
					hasLeftAssistants = true;
				} else {
					rightAssistants.push(child);
					hasRightAssistants = true;
				}

				assistantIdx += 1;
				hasAssistants = true;
			} else {
				divisions.push(child);
				hasDivisions = true;
			}
		}

		return (
			<div className={styles.group}>
				<table className={styles.parent}>
					<tbody>
						<tr>
							<td />
							<td className={styles.node}>
								<div
									className={styles.container}
									data-id={`${chartId}${node[idProperty]}`}
								>
									{render(node)}
								</div>
							</td>
							<td />
						</tr>

						{hasAssistants && (
							<tr>
								<td>
									{hasLeftAssistants && (
										<div className={styles.staffLeft}>
											<table>
												<tbody>
													{leftAssistants.map((child, idx) => (
														<tr key={idx}>
															<td>{renderNode(child)}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}
								</td>

								<td className={styles.gap} />

								<td>
									{hasRightAssistants && (
										<div className={styles.staffRight}>
											<table>
												<tbody>
													{rightAssistants.map((child, idx) => (
														<tr key={idx}>
															<td>{renderNode(child)}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
				{hasDivisions && (
					<table className={styles.children}>
						<tbody>
							<tr>
								{divisions.map((child, idx) => (
									<td key={idx}>{renderNode(child)}</td>
								))}
							</tr>
						</tbody>
					</table>
				)}
			</div>
		);
	};

	return (
		<div ref={containerRef} className={styles.orgChart} id={chartId}>
			{renderNode(data)}

			<svg ref={svgRef} className={styles.graph} />
		</div>
	);
};

const MemoizedOrgChart = React.memo(OrgChart);

export { MemoizedOrgChart as OrgChart };
