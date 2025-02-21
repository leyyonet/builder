# Builder
Builder component for JavaScript/TypeScript

- It generates virtual setter methods with returning existing object to use continuously
- It takes care of types of properties

## Install
``npm i @leyyo/builder``

## Samples
#### Import & Definitions
```typescript
import {Builder} from "./builder";

interface Person {
    name: string;
    age: number;
    married: boolean;
}
type AutoColor = 'white'|'black'|'red'|'blue'|'green'|'yellow';
class Auto {
    brand: string;
    year: number;
    color: AutoColor;
}
class Truck extends Auto {
    capacity: number;
}
class Bus extends Auto {
    passengers: number;

    constructor(year: number, passengers: number) {
        super();
        this.year = year;
        this.passengers = passengers
    }
}
```
#### Sample 01: No default values for object
```typescript
const person1 = Builder.build<Person>()
    .age(20)
    .name('Alex')
    .married(true)
    .$finalize(); // so important to shift from builder to your instance
console.log('Person 1');
console.log('  casted             => ', person1);
console.log('  constructor name   => ', person1.constructor.name); // always Object
/*
* Person 1
* casted             =>  { age: 20, name: 'Alex', married: true }
* constructor name   =>  Object
*/
```
#### Sample 02: with default values for object
```typescript
const person2 = Builder.build<Person>(null, {age: 50})
    .name('Lena')
    .married(false)
    .$finalize();
console.log('Person 2');
console.log('  casted             => ', person2);
/*
* Person 2
*  casted             =>  { age: 50, name: 'Lena', married: false }
*/
```
#### Sample 03: No default tuples for object
```typescript
const person3 = Builder.build<Person>(null, [['age', 40], ['name', 'Mat']])
    .married(true)
    .$finalize();
/*
* Person 3
*  casted             =>  { age: 40, name: 'Mat', married: true }
*/
```
#### Sample 04: No default values for class instance
```typescript
const auto1 = Builder.build<Auto>(Auto)
    .brand('Toyota')
    .year(2023)
    .color('red')
    .$finalize();
console.log('Auto 1');
console.log('  casted             => ', auto1);
console.log('  constructor name   => ', auto1.constructor.name); // should be Auto
/*
* Auto 1
*  casted             =>  Auto { brand: 'Toyota', year: 2023, color: 'red' }
*  constructor name   =>  Auto
* */
```
#### Sample 05: with default values for class instance
```typescript
const auto2 = Builder.build<Auto>(Auto, {brand: 'Ford'})
    .year(2018)
    .color('blue')
    .$finalize();
console.log('Auto 2');
console.log('  casted             => ', auto2);
/*
* Auto 2
*  casted             =>  Auto { brand: 'Ford', year: 2018, color: 'blue' }
* */
```
#### Sample 06: With default values as another instance for class instance
```typescript
const auto3 = Builder.build<Auto>(Auto, auto2) // it's enough when "auto2 instanceof Auto"
    .year(2014)
    .$finalize();
console.log('Auto3');
console.log('  casted             => ', auto3); // brand and color is cloned from auto2, but year is override
/*
* Auto3
  casted             =>  Auto { brand: 'Ford', year: 2014, color: 'blue' }
* */
```
#### Sample 07: with inheritance for class instance
```typescript
const truck1 = Builder.build<Truck>(Truck, {brand: 'Renault'})
    .year(2004)
    .color('yellow')
    .capacity(20)
    .$finalize();
console.log('Truck 1');
console.log('  casted             => ', truck1);
console.log('  constructor name   => ', truck1.constructor.name); // should be Truck
/*
* Truck 1
* casted             =>  Truck { brand: 'Renault', year: 2004, color: 'yellow', capacity: 20 }
* constructor name   =>  Truck
* */
```
#### Sample 08: With passing arguments for class instance
```typescript
// 
const bus1 = Builder.build<Bus>(Bus, [2025, 42]) // year and passengers, look constructor's argument order
    .brand('Volvo')
    .color('white')
    .$finalize();
console.log('Bus1 1');
console.log('  casted             => ', bus1);
console.log('  constructor name   => ', bus1.constructor.name); // should be Bus
/*
* Truck 1
* casted             =>  Truck { brand: 'Renault', year: 2004, color: 'yellow', capacity: 20 }
* constructor name   =>  Truck
* */
```

## Warnings & Possible Errors
#### Warning 01: Differences between builder and your instance

> You need to take attention to know between builder and instance,
> because builder has only setter methods thar are generated by given interface and class properties
> but instance is owned by you, and it contains all properties that are already set by builder

```typescript
const person5 = Builder.build<Person>()
    .age(19)
    .name('Thomas')
    .married(false);
console.log('Person 5');
console.log('  casted             => ', person5); // it's a builder, not an instance
console.log('  property:age       => ', typeof person5.age); // should be function as a setter method
console.log('  property:$finalize => ', typeof person5.$finalize); // should be function
console.log('  shift from builder to instance');
const person6 = person5.$finalize(); // getters are changed to normal values, and $finalize is removed
console.log('  casted             => ', person6); // it's an instance, not a builder
console.log('  property:age       => ', typeof person6.age); // should be number
console.log('  property:$finalize => ', typeof person6['$finalize']); // should be undefined
/*
* Person 5
*  casted             =>  { age: 19, name: 'Thomas', married: false, '$finalize': [Function (anonymous)] }
*  property:age       =>  function
*  property:$finalize =>  function
*  shift from builder to instance
*  casted             =>  { age: 19, name: 'Thomas', married: false }
*  property:age       =>  number
*  property:$finalize =>  undefined
* */
```
#### Error 02: Don't call again $finalize

> After calling $finalize() method, builder is transformed to your instance, so this method does exist anymore
> - `Runtime` exactly crashes
> - `Compiler` ( tsc ) possibly crashes
> - Your `IDE` may/should warn

```typescript
const person7 = Builder.build<Person>()
    .age(19)
    .name('Thomas')
    .married(false)
    .$finalize()
    .$finalize(); // Raise an compiler/runtime error, and also your IDE may warn
/*
* Possible Error:
*  TS2339: Property $finalize does not exist on type <ClassName>
* */
```
#### Warning 03: Type checking

> Setter method are generated by existing properties and it expects corresponding value
> - `Compiler` ( tsc ) possibly crashes
> - Your `IDE` may/should warn

```typescript
const person8 = Builder.build<Person>()
    .age('bla') // should be number
    .name([]) // should be string
    .married('false'); // should be boolean
/*
* Possible Error:
*  TS2345: Argument of type <INVALID_TYPE> is not assignable to parameter of type <expected>
* */
```
#### Warning 04: absent properties in default values

> Default values should be in given class/interface
> - `Compiler` ( tsc ) possibly crashes
> - Your `IDE` may/should warn

```typescript
const person9 = Builder.build<Person>(null, {noField: 5}); // noField does exists in Person
/*
* Possible Error:
*  TS2769: No overload matches this call. > Object literal may only specify known properties, and <ABSENT_PROPERTY> does not exist in type <type>
* */
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
