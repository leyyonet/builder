# Builder
Builder component for JavaScript/TypeScript

- It generates virtual setter methods with returning existing object to use continuously
- It takes care of types of properties

## Install
``npm i @leyyo/builder``

## Samples
```typescript
import {Builder} from "@leyyo/builder";

interface Person {
    name: string;
    age: number;
    married: boolean;
}

const builder = Builder.build<Person>();
builder
    .age(32)
    .name('foo bar')
    .married(true);
console.log(builder);
// {age: 32, name: 'foo bar', married: true}

builder.age('aaa'); // compile error
builder.name(55); // compile error
builder.married('yes'); // compile error

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
