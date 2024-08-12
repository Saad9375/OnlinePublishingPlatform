export interface Article {
  id?: number;
  isBookmark?: boolean;
  isFeatured?: boolean;
  title: string;
  comments: Comment[];
  date: Date;
  author: string;
  content: string;
  minutes: number;
  authorEmail: string;
  images?: string[];
}
