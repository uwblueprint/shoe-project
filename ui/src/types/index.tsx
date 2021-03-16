interface Model {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: {
    Time: string;
    Valid: boolean;
  };
}

export interface Story extends Model {
  title: string;
  content: string;
  current_city: string;
  year: number;
  is_visible: boolean;
  summary: string;
  latitude: number;
  longitude: number;
  image_url: string;
  video_url: string;
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

export interface Tokens {
  mapbox: string;
  zipcode: string;
  google_client_id: string;
}

export interface User extends Partial<Model> {
  email: string;
}
