import find from 'lodash.find';
import remove from 'lodash.remove';
import type {Person, Car} from '../types/index.js';

const people: Person[] = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates',
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs',
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds',
  },
];

const cars: Car[] = [
  {
    id: '1',
    year: '2019',
    make: 'Toyota',
    model: 'Corolla',
    price: '40000',
    personId: '1',
  },
  {
    id: '2',
    year: '2018',
    make: 'Lexus',
    model: 'LX 600',
    price: '13000',
    personId: '1',
  },
  {
    id: '3',
    year: '2017',
    make: 'Honda',
    model: 'Civic',
    price: '20000',
    personId: '1',
  },
  {
    id: '4',
    year: '2019',
    make: 'Acura ',
    model: 'MDX',
    price: '60000',
    personId: '2',
  },
  {
    id: '5',
    year: '2018',
    make: 'Ford',
    model: 'Focus',
    price: '35000',
    personId: '2',
  },
  {
    id: '6',
    year: '2017',
    make: 'Honda',
    model: 'Pilot',
    price: '45000',
    personId: '2',
  },
  {
    id: '7',
    year: '2019',
    make: 'Volkswagen',
    model: 'Golf',
    price: '40000',
    personId: '3',
  },
  {
    id: '8',
    year: '2018',
    make: 'Kia',
    model: 'Sorento',
    price: '45000',
    personId: '3',
  },
  {
    id: '9',
    year: '2017',
    make: 'Volvo',
    model: 'XC40',
    price: '55000',
    personId: '3',
  },
];

export const resolvers = {
  Query: {
    people: (): Person[] => people,
    person: (_: unknown, {id}: {id: string}): Person | undefined => find(people, {id}),
    cars: (): Car[] => cars,
    car: (_: unknown, {id}: {id: string}): Car | undefined => find(cars, {id}),
  },
  Mutation: {
    addPerson: (_: unknown, {firstName, lastName}: Person): Person => {
      const newPerson: Person = {
        id: (people.length + 1).toString(),
        firstName,
        lastName,
      };
      people.push(newPerson);
      return newPerson;
    },
    addCar: (_: unknown, {year, make, model, price, personId}: Car): Car => {
      const newCar: Car = {
        id: (cars.length + 1).toString(),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);
      return newCar;
    },
    updatePerson: (_: unknown, {id, firstName, lastName}: Person): Person | undefined => {
      const person = find(people, {id});
      if (!person) return undefined;
      if (firstName) person.firstName = firstName;
      if (lastName) person.lastName = lastName;
      return person;
    },
    updateCar: (_: unknown, {id, year, make, model, price, personId}: Car): Car | undefined => {
      const car = find(cars, {id});
      if (!car) return undefined;
      if (year) car.year = year;
      if (make) car.make = make;
      if (model) car.model = model;
      if (price) car.price = price;
      if (personId) car.personId = personId;
      return car;
    },
    deletePerson: (_: unknown, {id}: {id: string}): {id: string} | undefined => {
      const index = people.findIndex(person => person.id === id);
      if (index === -1) return undefined;
      people.splice(index, 1);
      remove(cars, {personId: id});
      return {id};
    },
    deleteCar: (_: unknown, {id}: {id: string}): {id: string} | undefined => {
      const index = cars.findIndex(car => car.id === id);
      if (index === -1) return undefined;
      cars.splice(index, 1);
      return {id};
    },
  },
  Person: {
    cars: (parent: Person): Car[] => cars.filter(car => car.personId === parent.id),
  },
  Car: {
    person: (parent: Car): Person | undefined => find(people, {id: parent.personId}),
  },
};
