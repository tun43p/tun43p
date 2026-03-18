# Zig Conventions

## Table of contents

- [Zig Conventions](#zig-conventions)
  - [Table of contents](#table-of-contents)
  - [Variables and fonctions](#variables-and-fonctions)
  - [Types](#types)
  - [Global Constants](#global-constants)
  - [Namespaces and modules](#namespaces-and-modules)
  - [Acronyms and abbreviations](#acronyms-and-abbreviations)

## Variables and fonctions

- Variables: `snake_case`
- Functions: `snake_case`
- Parameters: `snake_case`

```zig
const max_size = 1024;

fn calculate_total_price(price: i32, tax: i32) i32 {
    return price + tax;
}
```

## Types

- Types: `UpperCamelCase`
- Enums: `UpperCamelCase`
- Structs: `UpperCamelCase`
- Unions: `UpperCamelCase`

```zig
const Person = struct {
    name: []const u8,
    age: u32,
};
```

## Global Constants

- Global constants: `snake_case`

```zig
const max_size = 1024;
```

## Namespaces and modules

- Namespaces: `snake_case`
- Modules: `snake_case`

```zig
const http_client = @import("http_client.zig");
```

## Acronyms and abbreviations

Zig don't force capitalization for acronyms and abbreviations:

```zig
HTTPClient
JSONParser
```

But instead, capitalize only the first letter of each word:

```zig
HttpClient
JsonParser
```
