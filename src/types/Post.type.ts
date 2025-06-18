export interface Post {
  title: string;
  publishDate: string;
  slug: string;
  description: string;
  content?: string;
  tags?: string[];
  featured: boolean;
  draft: boolean;
}

export interface PostsCollection {
  data: {
    posts: Post[];
  };
}

export interface GroupedPostsByYear extends Array<[string, Post[]]> {}
