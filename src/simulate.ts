import {Builder} from "./builder";

interface Person {
    name: string;
    age: number;
    married: boolean;
}

const person = Builder.build<Person>();
person.age(2).name('a').married(true);
console.log(person.$return());

type CarColor = 'white'|'black'|'red'|'blue'|'green'|'yellow';
class Car {
    brand: string;
    year: number;
    color: CarColor;
}

const car = Builder.build<Car>(Car);
car.brand('Toyota').year(2023).color('red');
console.log(car.$return());