export interface Post {
	title: string;
	date: string;
	slug: string;
	description: string;
	content?: string;
	tags?: string[];
	featured?: boolean;
}

export interface PostsCollection {
	data: {
		posts: Post[];
	};
}
