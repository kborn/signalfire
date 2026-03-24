# Learning Card 02: TS Imports vs Nest DI

Two systems:

- TS import: lets this file name a class
- Nest module import: lets Nest provide that class

Example:

```ts
import { PrismaService } from '../prisma/prisma.service';
```

means:

- "this file knows what `PrismaService` is"

But this:

```ts
imports: [PrismaModule];
```

means:

- "Nest may inject `PrismaService` here"

Short version:

- file import = name visibility
- module import = DI availability
