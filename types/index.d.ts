export declare interface OrgChartProps<T> {
	/** Tree data to use */
	data: T;
	/** Render function for the nodes */
	render: (node: T) => React.ReactNode;
	/** Unique ID for the chart */
	chartId?: string;
	/** The property to use to look up if the node is a staff */
	staffProperty?: string;
	/** The property to use to get the node ID */
	idProperty?: string;
	/** The property to use to get the node children */
	childrenProperty?: string;
	/** The property to use to get the stroke style for the lines */
	strokeStyleProperty?: string;
}

export declare function OrgChart<T> (props: OrgChartProps<T>): React.ReactElement;
