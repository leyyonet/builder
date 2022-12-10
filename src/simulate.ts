import {Builder} from "./builder";

interface Person {
    name: string;
    age: number;
    married: boolean;
}

const builder2 = Builder.build<Person>();
console.log(builder2);
builder2.age(2).name('a').married(true);
console.log(builder2);