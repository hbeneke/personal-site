export interface Project {
	title: string;
	date: string;
	description: string;
	technologies: string[];
	link: string;
}

export interface PortfolioCollection {
	data: {
		projects: Project[];
	};
}
