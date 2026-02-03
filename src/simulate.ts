import { Builder } from './builder.js';

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

/*

// No default values
const person1 = Builder.build<Person>()
    .age(20)
    .name('Alex')
    .married(true)
    .$finalize(); // so important to shift from builder to your instance
console.log('Person 1');
console.log('  casted             => ', person1);
console.log('  constructor name   => ', person1.constructor.name); // always Object

// with default values
const person2 = Builder.build<Person>(null, {age: 50})
    .name('Lena')
    .married(false)
    .$finalize();
console.log('Person 2');
console.log('  casted             => ', person2);

// with default tuples
const person3 = Builder.build<Person>(null, [['age', 40], ['name', 'Mat']])
    .married(true)
    .$finalize();
console.log('Person 3');
console.log('  casted             => ', person3);

// Object samples

// No default values
const auto1 = Builder.build<Auto>(Auto)
    .brand('Toyota')
    .year(2023)
    .color('red')
    .$finalize();
console.log('Auto 1');
console.log('  casted             => ', auto1);
console.log('  constructor name   => ', auto1.constructor.name); // should be Auto

// With default values
const auto2 = Builder.build<Auto>(Auto, {brand: 'Ford'})
    .year(2018)
    .color('blue')
    .$finalize();
console.log('Auto 2');
console.log('  casted             => ', auto2);

// With default values as another class instance
const auto3 = Builder.build<Auto>(Auto, auto2)
    .year(2014)
    .$finalize();
console.log('Auto3');
console.log('  casted             => ', auto3); // brand and color is cloned from auto2, but year is override

// With inheritance
const truck1 = Builder.build<Truck>(Truck, {brand: 'Renault'})
    .year(2004)
    .color('yellow')
    .capacity(20)
    .$finalize();
console.log('Truck 1');
console.log('  casted             => ', truck1);
console.log('  constructor name   => ', truck1.constructor.name); // should be Truck

// With passing arguments
const bus1 = Builder.build<Bus>(Bus, [2025, 42]) // year and passengers, look constructor's argument order
    .brand('Volvo')
    .color('white')
    .$finalize();
console.log('Bus1 1');
console.log('  casted             => ', bus1);
console.log('  constructor name   => ', bus1.constructor.name); // should be Bus

// Differences between builder and your instance
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
*/

// No default values
let p44: Person;
const person44 = Builder.build<Person>()
    .$callback(p => p44 = p)
    .age(20)
    .name('Alex')
    .married(true)
    .$finalize(); // so important to shift from builder to your instance
console.log('Person with Callback');
console.log('  casted             => ', person44);
console.log('  callback           => ', p44);

// No default values
const person45: Person = {
    name: 'Jan',
    age: 22,
    married: false,
};
Builder.build<Person>(person45)
    .$setItem((k, v) => {
        person45[k as 'name'] = v as string;
    })
    .age(30)
    .name('Alex')
    .married(true); // so important to shift from builder to your instance
console.log('Person with SetItem');
console.log('  set             => ', person45);

/*
// Don't call again $finalize
const person7 = Builder.build<Person>()
    .age(19)
    .name('Thomas')
    .married(false)
    .$finalize()
    .$finalize();

// Compile errors & type checking
const person8 = Builder.build<Person>()
    .age('bla')
    .name([])
    .married('false');

// For absent properties in default values
const person9 = Builder.build<Person>(null, {noField: 5});
*/
