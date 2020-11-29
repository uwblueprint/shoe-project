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
  latitude: number;
  longitude: number;
}

export interface Author extends Model {
  firstName: string;
  lastName?: string;
  bio?: string;
  originCountry?: string;
  currentCity: string;
  stories?: Story[];
}
