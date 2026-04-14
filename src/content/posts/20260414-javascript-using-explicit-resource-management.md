---
title: "The using keyword: JavaScript finally learned how to clean up after itself"
publishDate: "2026-04-14T10:00:00.000Z"
slug: "javascript-using-explicit-resource-management"
description: "JavaScript finally got explicit resource management with the using and await using keywords. No more try/finally pyramids, no more forgotten cleanups. Heres how it works and why you should start using it today."
tags: ["javascript", "ecmascript", "node", "typescript", "tutorial", "web development"]
featured: true
draft: false
readTime: 11
---

## The try/finally pyramid of doom

If youve written any non-trivial JavaScript that touches files, database connections, locks, or anything that needs cleanup, you already know this pain. You open something, you do stuff, and then you pray you remember to close it. And because errors can happen anywhere, you end up wrapping everything in `try/finally`. And then you nest another one. And another.

```javascript
const file = await fs.open('data.txt');
try {
  const conn = await db.connect();
  try {
    const lock = await mutex.acquire();
    try {
      // actual work here, buried six levels deep
    } finally {
      lock.release();
    }
  } finally {
    await conn.close();
  }
} finally {
  await file.close();
}
```

Im getting PTSD just typing that. Ive written code that looks exactly like this in production and Im not proud of it.

The worst part isnt the ugliness. Its that one day youre tired, its 6pm on a Friday, and you add a new resource in the middle of this mess and forget one of the `finally` blocks. Nothing breaks in tests. Nothing breaks in staging. Then three weeks later your server starts leaking file descriptors and you spend a weekend figuring out why.

C# had `using` since forever. Python has `with`. Go has `defer`. Java has try-with-resources. And JavaScript? JavaScript had "good luck, be careful". Until now.

## Enter using

The proposal is called [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) and it reached Stage 4 in 2024, which means its officially part of the language. It landed in V8, which means Chrome, Edge, and Node 24 all support it. TypeScript has supported it since 5.2.

The idea is dead simple. You declare a variable with `using` instead of `const` or `let`, and when that variable goes out of scope, JavaScript automatically calls its cleanup method for you. No more `finally`. No more forgetting.

```javascript
{
  using file = openFile('data.txt');
  // do stuff with file
} // file is automatically closed here, even if an error was thrown
```

Thats it. Thats the whole feature. Well, almost - theres a couple of interesting details but the core idea fits in three lines.

## Symbol.dispose is the magic

For `using` to know how to clean up your object, the object needs a method at the well-known symbol `Symbol.dispose`. Thats the contract. If your object has it, `using` will call it automatically when the scope ends.

```javascript
function openFile(path) {
  const handle = lowLevelOpen(path);
  return {
    read() { return lowLevelRead(handle); },
    [Symbol.dispose]() {
      console.log('closing file');
      lowLevelClose(handle);
    }
  };
}

{
  using file = openFile('data.txt');
  const content = file.read();
  // no need to close anything
}
// "closing file" gets printed right here
```

If youre coming from Python, this is basically `__exit__`. If youre from C#, its `IDisposable.Dispose`. Same concept, JavaScript finally caught up.

The cool thing is that it works with any object. You can retrofit this onto libraries you dont control by wrapping them. Or you can add it to your own classes and suddenly all your users get automatic cleanup for free.

## await using for the async world

Most real cleanup in JavaScript is async. Closing a database connection, flushing a stream, releasing a distributed lock - all of these return promises. For those you use `await using` and the object needs to implement `Symbol.asyncDispose` instead.

```javascript
async function openConnection(url) {
  const conn = await db.connect(url);
  return {
    query(sql) { return conn.query(sql); },
    async [Symbol.asyncDispose]() {
      await conn.close();
    }
  };
}

async function getUsers() {
  await using conn = await openConnection(process.env.DB_URL);
  return conn.query('SELECT * FROM users');
  // conn.close() gets awaited here, before the function returns
}
```

The `await using` tells the runtime "when this scope ends, await the dispose method". If you forget the `await` and just write `using`, it wont await and youll get weird timing bugs. TypeScript will yell at you about this, which is nice.

## It works with iteration and errors too

Heres where it gets good. If you have multiple `using` declarations in the same scope, they dispose in **reverse order**. Like a stack. Which is exactly what you want because later resources usually depend on earlier ones.

```javascript
async function doStuff() {
  await using file = await openFile('input.txt');
  await using conn = await openConnection();
  await using lock = await acquireLock();

  // work happens
  // cleanup order: lock -> conn -> file
}
```

Compare that to the nested `try/finally` monster from earlier. Same behavior. Way less code. Impossible to screw up.

And if an error happens during disposal, it doesnt just silently swallow your other cleanups. JavaScript uses a new error type called `SuppressedError` that wraps both the original error and the disposal error, so you can actually debug what went wrong. I remember spending hours on a bug years ago where a `finally` block threw and masked the real exception. This fixes that class of problem.

## DisposableStack for when you need more control

Sometimes you dont know upfront how many resources youll need. Maybe youre opening files in a loop, or conditionally acquiring stuff. For that theres `DisposableStack` and its async cousin `AsyncDisposableStack`.

```javascript
async function processFiles(paths) {
  await using stack = new AsyncDisposableStack();

  const files = [];
  for (const path of paths) {
    const file = await openFile(path);
    stack.use(file);
    files.push(file);
  }

  // do something with all the files
  // when the function exits, every file gets closed in reverse order
}
```

You can also use `stack.defer(() => { ... })` to register arbitrary cleanup callbacks, which is basically Gos `defer` keyword ported to JavaScript. I was way more excited about this than I should have been.

## The boring but important part: support

As of April 2026:

| Runtime | Support |
|---------|---------|
| Node.js 24+ | Yes |
| Chrome 134+ | Yes |
| Edge 134+ | Yes |
| Firefox | Behind flag |
| Safari 18.4+ | Yes |
| TypeScript 5.2+ | Yes |
| Bun 1.2+ | Yes |
| Deno 2+ | Yes |

If you target Node, youre basically good. Browsers are further along than I expected. If you need broader compatibility theres the [disposablestack polyfill](https://www.npmjs.com/package/disposablestack) which also ships `Symbol.dispose` and `Symbol.asyncDispose`. TypeScript handles the downlevel compilation for older targets automatically.

One thing to watch out for - `using` declarations cant be used at the top level of a module the same way `const` can, because modules dont really have a "scope exit" in the normal sense. You can use it inside blocks, functions, and other normal scopes. In practice this is almost never a problem because cleanup usually belongs inside functions anyway.

## Real world: where this actually matters

Let me give you three places where I immediately started using this and never looked back.

**Database transactions.** Before, I had a helper function that took a callback and wrapped it in begin/commit/rollback. It worked but the control flow was weird, you couldnt return early cleanly, and stack traces were ugly. Now:

```javascript
async function transfer(from, to, amount) {
  await using tx = await db.transaction();
  await tx.debit(from, amount);
  await tx.credit(to, amount);
  await tx.commit();
  // if anything throws, Symbol.asyncDispose rolls back
}
```

The `Symbol.asyncDispose` checks if the transaction was committed and rolls back if not. Flat code, normal control flow, no callbacks.

**Temporary files in tests.** Every test suite has that one test that creates a temp file and forgets to delete it. Then CI runs out of disk space on a Tuesday. With `using`:

```javascript
test('parses the thing', async () => {
  await using tmp = await createTempFile('input data');
  const result = await parseFile(tmp.path);
  expect(result).toEqual(expected);
});
```

Temp file gets deleted no matter what. Tests pass, tests fail, tests throw - doesnt matter. Its gone.

**Distributed locks.** I work on systems that use Redis locks and the number of times weve had to track down a lock that wasnt released because of some weird error path is embarrassing. `await using` makes this literally impossible to forget.

## The bottom line

`using` isnt flashy. Theres no new syntax to learn beyond one keyword. Its not going to change how you architect your apps. Its just one of those features that quietly removes an entire category of bugs from your codebase.

Every language that has resource management this way is better for it. JavaScript has been without it for 30 years and weve all been writing the same `try/finally` dance over and over, copy-pasting it, forgetting it, leaking resources in production and blaming it on "memory issues".

If you write Node code today, start using this. TypeScript users especially - the type system will guide you through it. Your future self, debugging a file descriptor leak at 2am, will be very grateful.

And for the love of god, delete those nested `finally` blocks from your codebase. They had a good run. Let them rest.

---

## References

- [TC39 Explicit Resource Management Proposal](https://github.com/tc39/proposal-explicit-resource-management)
- [MDN - using declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using)
- [TypeScript 5.2 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/)
- [V8 blog post on Explicit Resource Management](https://v8.dev/features/explicit-resource-management)
- [disposablestack polyfill](https://www.npmjs.com/package/disposablestack)
- That one Friday at 6pm when I forgot a finally block and ruined my weekend
