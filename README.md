# F1 Manager Web

Jogo de gerenciamento de automobilismo em modo texto/menus para navegador.
Todos os nomes de equipes, pilotos e circuitos são fictícios.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (por padrão http://localhost:5173).

## Como testar

```bash
npm test        # roda todos os testes (Vitest)
npm run lint    # ESLint (inclui regras de arquitetura)
npm run build   # typecheck (tsc) + build de produção
```

## Estrutura de pastas

| Pasta         | Responsabilidade                                                                 |
| ------------- | -------------------------------------------------------------------------------- |
| `src/engine/` | Lógica de simulação em TypeScript puro. Proibido importar React, Zustand ou UI.  |
| `src/ui/`     | Componentes React. Lê estado e dispara ações; nunca contém regra de negócio.     |
| `src/data/`   | Dados estáticos do jogo (equipes, pilotos, circuitos — todos fictícios).         |

Toda aleatoriedade da engine usa o RNG com seed injetável de `src/engine/rng.ts`
(mulberry32): a mesma seed produz sempre a mesma sequência. `Math.random` é
bloqueado por regra de lint.
