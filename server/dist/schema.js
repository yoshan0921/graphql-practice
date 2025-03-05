var _templateObject;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
import { gql } from 'graphql-tag';
import find from 'lodash.find';
import remove from 'lodash.remove';
var _people = [{
  id: '1',
  firstName: 'Bill',
  lastName: 'Gates'
}, {
  id: '2',
  firstName: 'Steve',
  lastName: 'Jobs'
}, {
  id: '3',
  firstName: 'Linux',
  lastName: 'Torvalds'
}];
var _cars = [{
  id: '1',
  year: '2019',
  make: 'Toyota',
  model: 'Corolla',
  price: '40000',
  personId: '1'
}, {
  id: '2',
  year: '2018',
  make: 'Lexus',
  model: 'LX 600',
  price: '13000',
  personId: '1'
}, {
  id: '3',
  year: '2017',
  make: 'Honda',
  model: 'Civic',
  price: '20000',
  personId: '1'
}, {
  id: '4',
  year: '2019',
  make: 'Acura ',
  model: 'MDX',
  price: '60000',
  personId: '2'
}, {
  id: '5',
  year: '2018',
  make: 'Ford',
  model: 'Focus',
  price: '35000',
  personId: '2'
}, {
  id: '6',
  year: '2017',
  make: 'Honda',
  model: 'Pilot',
  price: '45000',
  personId: '2'
}, {
  id: '7',
  year: '2019',
  make: 'Volkswagen',
  model: 'Golf',
  price: '40000',
  personId: '3'
}, {
  id: '8',
  year: '2018',
  make: 'Kia',
  model: 'Sorento',
  price: '45000',
  personId: '3'
}, {
  id: '9',
  year: '2017',
  make: 'Volvo',
  model: 'XC40',
  price: '55000',
  personId: '3'
}];
export var typeDefs = gql(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  type Query {\n    people: [Person]\n    person(id: ID!): Person\n    cars: [Car]\n    car(id: ID!): Car\n  }\n\n  type Mutation {\n    addPerson(firstName: String!, lastName: String!): Person\n    addCar(year: String!, make: String!, model: String!, price: String!, personId: ID!): Car\n    updatePerson(id: ID!, firstName: String, lastName: String): Person\n    updateCar(id: ID!, year: String, make: String, model: String, price: String, personId: ID): Car\n    deletePerson(id: ID!): ID\n    deleteCar(id: ID!): ID\n  }\n\n  type Person {\n    id: ID!\n    firstName: String\n    lastName: String\n    cars: [Car]\n  }\n\n  type Car {\n    id: ID!\n    year: String\n    make: String\n    model: String\n    price: String\n    person: Person\n  }\n"])));
export var resolvers = {
  Query: {
    people: function people() {
      return _people;
    },
    person: function person(_, _ref) {
      var id = _ref.id;
      return find(_people, {
        id: id
      });
    },
    cars: function cars() {
      return _cars;
    },
    car: function car(_, _ref2) {
      var id = _ref2.id;
      return find(_cars, {
        id: id
      });
    }
  },
  Mutation: {
    addPerson: function addPerson(_, _ref3) {
      var firstName = _ref3.firstName,
        lastName = _ref3.lastName;
      var newPerson = {
        id: (_people.length + 1).toString(),
        firstName: firstName,
        lastName: lastName
      };
      _people.push(newPerson);
      return newPerson;
    },
    addCar: function addCar(_, _ref4) {
      var year = _ref4.year,
        make = _ref4.make,
        model = _ref4.model,
        price = _ref4.price,
        personId = _ref4.personId;
      var newCar = {
        id: (_cars.length + 1).toString(),
        year: year,
        make: make,
        model: model,
        price: price,
        personId: personId
      };
      _cars.push(newCar);
      return newCar;
    },
    updatePerson: function updatePerson(_, _ref5) {
      var id = _ref5.id,
        firstName = _ref5.firstName,
        lastName = _ref5.lastName;
      var person = find(_people, {
        id: id
      });
      if (!person) return undefined;
      if (firstName) person.firstName = firstName;
      if (lastName) person.lastName = lastName;
      return person;
    },
    updateCar: function updateCar(_, _ref6) {
      var id = _ref6.id,
        year = _ref6.year,
        make = _ref6.make,
        model = _ref6.model,
        price = _ref6.price,
        personId = _ref6.personId;
      var car = find(_cars, {
        id: id
      });
      if (!car) return undefined;
      if (year) car.year = year;
      if (make) car.make = make;
      if (model) car.model = model;
      if (price) car.price = price;
      if (personId) car.personId = personId;
      return car;
    },
    deletePerson: function deletePerson(_, _ref7) {
      var id = _ref7.id;
      var index = _people.findIndex(function (person) {
        return person.id === id;
      });
      if (index === -1) return undefined;
      _people.splice(index, 1);
      remove(_cars, {
        personId: id
      });
      return id;
    },
    deleteCar: function deleteCar(_, _ref8) {
      var id = _ref8.id;
      var index = _cars.findIndex(function (car) {
        return car.id === id;
      });
      if (index === -1) return undefined;
      _cars.splice(index, 1);
      return id;
    }
  },
  Person: {
    cars: function cars(parent) {
      return _cars.filter(function (car) {
        return car.personId === parent.id;
      });
    }
  },
  Car: {
    person: function person(parent) {
      return find(_people, {
        id: parent.personId
      });
    }
  }
};