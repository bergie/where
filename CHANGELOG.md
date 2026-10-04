# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fixed bearing calculations across the antimeridian

## [0.4.2] - 2023-02-16

### Security

- Release to update dependencies due to security issues

## [0.4.1] - 2020-08-19

### Changed

- `distanceTo` method now returns distances rounded to one meter accuracy instead of 100 meter accuracy

## [0.4.0] - 2019-10-01

### Removed

- Removed legacy [NodeXT](https://www.npmjs.com/package/nodext) support

## [0.3.2] - 2019-10-01

### Added

- Also available on [GitHub Package Registry](https://github.com/bergie/where/packages/29476)

## [0.3.1] - 2018-11-03

### Changed

- Switched from request to the fetch library for browser compat

## [0.3.0] - 2017-10-16

### Changed

- Switched asynchronous geocoding methods to return a promise instead of using a callback
