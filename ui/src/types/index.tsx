interface Model {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: {
    time: string;
    valid: boolean;
  };
}

export interface Story extends Model {
  title: string;
  content: string;
  current_city: string;
  summary: string;
  latitude: number;
  longitude: number;
  image_url: string;
  author_first_name: string;
  author_last_name: string;
  author_country: string;
  author: Author;
}

export interface Author extends Model {
  firstName: string;
  lastName?: string;
  bio?: string;
  originCountry?: string;
  currentCity: string;
  stories?: Story[];
}
