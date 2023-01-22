# Builder
Builder component for JavaScript/TypeScript

- It generates virtual setter methods with returning existing object to use continuously
- It takes care of types of properties

## Install
``npm i @leyyo/builder``

## Sample - Object
```typescript
import {Builder} from "@leyyo/builder";

interface Person {
    name: string;
    age: number;
    married: boolean;
}

const person = Builder.build<Person>();
person
    .age(32)
    .name('foo bar')
    .married(true);
console.log(person);
// {age: 32, name: 'foo bar', married: true}

person.age('aaa'); // compile error
person.name(55); // compile error
person.married('yes'); // compile error

```

## Sample - Class
```typescript
type CarColor = 'white'|'black'|'red'|'blue'|'green'|'yellow';
class Car {
    brand: string;
    year: number;
    color: CarColor;
}

const car = Builder.build<Car>(Car);
car.brand('Toyota').year(2023).color('red');
console.log(car);
// {brand: 'Toyota', year: 2023, color: 'red'}

console.log(car.$return()); // it is casted to Car class
// Car {brand: 'Toyota', year: 2023, color: 'red'}
```
## Standards
- [x] Language: `TS`
- [x] Eslint: `Yes`
- [x] Static Code Analysis: `Yes` *IntelliJ Code Inspections*
- [x] DDD - Document Driven: `No` *No required*
- [ ] EDD - Exception Driven: `No` *No required*
- [x] TDD - Test Driven: `No`

## Commands
- ``npm run clear`` *// clears "dist" folder*
- ``npm run lint`` *// runs eslint for static code analysis*
- ``npm run build`` *// builds JS files at "dist" folder*
- ``npm run test`` *// runs test files in "test" folder*
- ``npm run test:watch`` *// runs test with watch option
- ``npm run test:coverage`` *// runs test with coverage

## Author
- `Date` 2022-12-10
- `Name` Mustafa Yelmer
- `Repo` [github.com/leyyonet/builder](https://github.com/leyyonet/builder)
