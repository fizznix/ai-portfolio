export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  featured: boolean;
  order: number;
  link?: string;
}

export interface Blog {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  date: string;
  tags: string[];
}

export interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  buyLink: string;
  highlights: string[];
}

export interface NowItem {
  id: string;
  text: string;
  active: boolean;
}
