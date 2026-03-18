# Project ideas to learn Zig

## Table of contents

- [Project ideas to learn Zig](#project-ideas-to-learn-zig)
  - [Table of contents](#table-of-contents)
  - [Level 1 - Understanding the basics](#level-1---understanding-the-basics)
    - [Rewrite an advanced `cat`](#rewrite-an-advanced-cat)
    - [Mini `grep`](#mini-grep)
    - [JSON parser](#json-parser)
  - [Level 2 - Thinking the Zig way](#level-2---thinking-the-zig-way)
    - [Memory arena allocator](#memory-arena-allocator)
    - [HTTP client](#http-client)
    - [Code statistics CLI tool](#code-statistics-cli-tool)
    - [Dependency graph analyzer](#dependency-graph-analyzer)
  - [Level 3 - Becoming proficient](#level-3---becoming-proficient)
    - [Task runner](#task-runner)
    - [Binary inspector](#binary-inspector)
    - [SQLite reader](#sqlite-reader)
  - [Level 4 - Advanced engineering projects](#level-4---advanced-engineering-projects)
    - [Mini language interpreter](#mini-language-interpreter)
    - [High performance log analyzer](#high-performance-log-analyzer)
    - [Dataset cleaner CLI](#dataset-cleaner-cli)

## Level 1 - Understanding the basics

Goals: Syntax, Memory, Error handling, stdlib

### Rewrite an advanced `cat`

Clone of `cat file.txt`

But with:

- number of lines
- highlight specific words
- file stats
- encoding detection

To learn:

- file IO
- allocators
- slices
- error handling
- defer

Skills Zig:

- std.fs
- std.mem
- allocators
- error unions

### Mini `grep`

Clone of `grep pattern file.txt`

But with:

- regex
- colors
- multiple files
- recursive search

To learn:

- string manipulation
- pattern matching
- performance loops
- buffered IO

Skills Zig:

- std.regex (or custom implementation)
- std.io.bufferedReader
- iterators
- memory management

### JSON parser

Parse:

`{"name":"alex","age":30}`

Without using std.json.

But with:

- objects
- arrays
- numbers
- strings
- booleans
- null

To learn:

- parsing state machines
- tagged unions
- recursive data structures
- error design
- manual memory management

Skills Zig:

- union(enum)
- comptime basics
- slices
- tokenizer design

## Level 2 - Thinking the Zig way

Goals: Memory control, architecture, low level thinking

### Memory arena allocator

Implement:

- Arena allocator
- Pool allocator
- Free list allocator

To learn:

- memory lifetime management
- allocation strategies
- fragmentation problems
- deterministic memory usage

Skills Zig:

- std.heap
- allocators design patterns
- pointers
- struct layout

### HTTP client

Build a basic HTTP client without std.http.

Example:

`GET / HTTP/1.1`

Features:

- TCP connection
- request builder
- response parser
- headers parsing
- timeout handling

To learn:

- sockets
- protocol parsing
- buffers
- streaming data

Skills Zig:

- std.net
- std.io
- byte buffers
- error propagation

### Code statistics CLI tool

Example:

`code-stats ./project`

Displays:

- total lines
- code lines
- comment lines
- blank lines
- languages detected

To learn:

- directory traversal
- file filtering
- text processing
- performance considerations

Skills Zig:

- std.fs.walk
- hash maps
- string analysis
- CLI arguments parsing

### Dependency graph analyzer

Analyze imports in:

- Zig
- Go
- Python

Generate:

- dependency tree
- graph structure
- circular dependency detection

To learn:

- graph structures
- file parsing
- architecture analysis

Skills Zig:

- hash maps
- graph traversal
- DFS / BFS
- string parsing

## Level 3 - Becoming proficient

Goals: Systems programming confidence

### Task runner

Like:

`make`
`just`
`task`

Example:

`zig run task build`

Features:

- task definitions
- dependencies
- parallel execution
- environment variables

To learn:

- process spawning
- concurrency basics
- CLI UX design

Skills Zig:

- std.process
- threading
- synchronization
- CLI parsing

### Binary inspector

Read executable formats:

- ELF
- Mach-O
- PE

Display:

- headers
- sections
- symbols
- entrypoints

To learn:

- binary layouts
- endianess
- struct packing
- reverse engineering basics

Skills Zig:

- packed structs
- bit manipulation
- file offsets
- binary parsing

### SQLite reader

Read a SQLite database without using SQLite.

Features:

- page parsing
- table listing
- simple SELECT support
- B-tree traversal

To learn:

- file format reverse engineering
- tree structures
- page management

Skills Zig:

- binary parsing
- tree traversal
- struct mapping
- memory views

## Level 4 - Advanced engineering projects

Goals: Real engineering level Zig usage

### Mini language interpreter

Language example:

```txt
let x = 5
let y = 10
print x + y
```

Components:

- lexer
- parser
- AST
- interpreter

To learn:

- compiler fundamentals
- architecture design
- execution models

Skills Zig:

- enums
- tagged unions
- recursive structures
- memory ownership

### High performance log analyzer

Analyze very large logs:

Example:

`analyze logs.txt`

Features:

- streaming processing
- pattern detection
- metrics extraction
- parallel processing

To learn:

- performance engineering
- cache efficiency
- streaming architecture

Skills Zig:

- threading
- buffered IO
- lock strategies
- performance profiling

### Dataset cleaner CLI

Example:

`clean-dataset data.jsonl`

Features:

- deduplication
- normalization
- filtering
- statistics
- validation

To learn:

- large file processing
- data pipelines
- performance optimization

Skills Zig:

- streaming parsers
- memory reuse
- data transformation
- CLI design
