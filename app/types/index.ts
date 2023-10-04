export enum Species {
  HUMAN = "human",
  DOG = "dog",
  CAT = "cat",
}

export type Animal = {
  _id?: string;
  _createdAt?: string;
  _updatedAt?: string;
  name: string;
  slug?: {
    current: string;
  };
  species: Species;
  owner?: Animal | any; // This references another animal, so we can use the same type.
  good: boolean;
  image?: {
    asset: {
      _ref: string;
      type: "reference";
    };
  };
  content?: any;
};
