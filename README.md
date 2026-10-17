# BloGO
**Família:**
- Arthur Marcelino
- Cauã Rocha
- João Vitor

### Como rodar

Na pasta `src` faça uma pasta chamada `database`, dentro da pasta `database`, crie um arquivo chamado `db.json`, dentro desse arquivo bote isso:

```json
{
  "users": [],
  "groups": [],
  "posts": []
}
```
**Estrutura:** `/src/database/db.json`

### Se estiver usando o NPM
```bash
npm install
```
**Para rodar:**
```bash
npx concurrently "npm run dev" "npm run server"
```
ou
```bash
npm run dev
npm run server
```

### Se estiver usando o BUN
```bash
bun install
```
**Para rodar:**
```bash
bun run start
```

Agora é só acessar o [site localmente](http://localhost:8000) 