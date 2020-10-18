// Todo: Remove Record<string, any> typing when JSON is fixed
// See: https://github.com/uwblueprint/shoe-project/issues/62
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Model extends Record<string, any> {
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
}

export interface Author extends Model {
  firstName: string;
  lastName?: string;
  bio?: string;
  originCountry?: string;
  currentCity: string;
  stories?: Story[];
}
