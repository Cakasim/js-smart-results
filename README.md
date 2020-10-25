Smart Results for JS
====================

[![Build Status](https://travis-ci.org/Cakasim/js-smart-results.svg?branch=develop)](https://travis-ci.org/Cakasim/js-smart-results)
[![Coverage Status](https://coveralls.io/repos/github/Cakasim/js-smart-results/badge.svg?branch=develop)](https://coveralls.io/github/Cakasim/js-smart-results?branch=develop)
[![LICENSE](https://img.shields.io/github/license/Cakasim/js-smart-results.svg)](LICENSE)

Introduction
------------

This is just a small library to make error handling somewhat joy in TypeScript. It is heavily inspired by Rust and
its great concepts about error handling.

How to Use?
-----------

Currently there are two types you can mak use of:

 - `Option<T>` which is a union type of `Some<T>` and `None<T>`
 - `Result<T, E>` which is a union type of `Ok<T, E>` and `Err<T, E>`

The type `Option<T>` comes with two helper functions, `some(value)` and `none()`. You should use these functions to create an `Option<T>`.
The type `Result<T, E>` follows the same principle except that you will have `ok(value)` and `err(value)` to create it.

The following code provides a brief overview which helps understanding the concepts.

```ts
import { Option, some, none, Result, ok, err } from '@cakasim/smart-results';

// Just a simple type for us to play with
type Animal = {
  name: string;
};

// Another type which holds metrics about an animal
type Metric = {
  minSize: number;
  maxSize: number;
  isCarnivorous: boolean;
  cutenessFactor: number;
};

// A pre-filled list of animals
const animals = new Map<number, Animal>([
  [1, { name: 'Ape' }],
  [2, { name: 'Dog' }],
  [3, { name: 'Cat' }],
  [4, { name: 'Pig' }],
  [5, { name: 'Bird' }],
])

/**
 * Finds an animal in the list and returns an Option<Animal>
 * which holds a valid animal if we have found an entry or nothing
 * if there is no entry for the provided ID.
 *
 * @param id Animal ID.
 */
function findAnimal(id: number): Option<Animal>
{
  // Get animal for provided ID, or undefined if ID is invalid
  const animal = animals.get(id);

  // Check if animal is not undefined and return either Some or None
  return animal
    ? some(animal)
    : none();
}

/**
 * Fetches a metric dataset about the provided animal from an HTTP Rest API.
 * The return value is a Promise that (always) resolves to a Result<Metric, Error>.
 * If a metric could be loaded the result contains a valid Metric value.
 * Otherwise the result contains an Error value.
 *
 * @param animal The animal.
 */
async function fetchAnimalMetric(animal: Animal): Promise<Result<Metric, Error>>
{
  // Assume we are fetching actual data here
  const response = await fetchAnimalMetricFromRestApi(animal);

  // Check if the response code is good and return either Ok or Err
  return response.statusCode === 200
    ? ok(response.data as Metric)
    : err(new Error(`Could not fetch from HTTP API, go status code ${response.statusCode}.`));
}

/**
 * This is the function that gets actually executed by someone.
 *
 * @param animalId Animal ID.
 */
async function printAnimalMetric(animalId: number)
{
  // Search for the animal, *expect* a None result and handle it by throwing the provided Error.
  // If the result is Some no error will be thrown. Please note that `expect()` should be used
  // carefully only if the exception case can be handled properly.
  const animal = findAnimal(animalId).expect(() => new Error(`Cannot find animal for ID ${animalId}.`));

  // metric is a Result<Metric, Error>, at this point we are forced to check for a valid result
  const metric = await fetchAnimalMetric(animal);

  if (metric.isErr()) {
    // Handle the error case
    console.error(`Failed to fetch data for animal ID ${animalId} with name ${animal.name} from REST API: ${metric.value.message}`);
  } else {
    // At this point metric.value is safe to use
    console.log(`The metric for animal ID ${animalId} with name ${animal.name} is:`);
    console.log(metric.value);
  }
}
```
