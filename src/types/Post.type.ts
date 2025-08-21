export interface Post {
  title: string;
  publishDate: string;
  slug: string;
  description: string;
  content?: string;
  tags?: string[];
  featured: boolean;
  draft: boolean;
  readTime?: number;
  updated?: string;
}

export interface PostsCollection {
  data: {
    posts: Post[];
  };
}

export interface GroupedPostsByYear extends Array<[string, Post[]]> {}
