export type Car = {
  id: string;
  year: string;
  make: string;
  model: string;
  price: string;
  personId: string;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  cars: Car[];
};
