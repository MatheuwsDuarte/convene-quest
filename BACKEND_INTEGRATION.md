# Guia de Integração com Backend

Este documento descreve a estrutura preparada para integração com o backend.

## Estrutura de API

O arquivo `src/services/api.ts` contém toda a estrutura de APIs preparada para integração com o backend.

### Interfaces TypeScript

Todas as interfaces estão definidas e prontas para uso:

- **Event**: Representa eventos (oficinas, palestras, reuniões)
- **User**: Representa usuários e administradores
- **Enrollment**: Representa inscrições em eventos
- **Rating**: Representa avaliações de eventos

### APIs Disponíveis

#### 1. Event API (`eventAPI`)
```typescript
// Buscar todos os eventos
eventAPI.getAll(): Promise<Event[]>

// Buscar evento por ID
eventAPI.getById(id: string): Promise<Event>

// Criar novo evento (apenas admin)
eventAPI.create(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event>

// Atualizar evento (apenas admin)
eventAPI.update(id: string, event: Partial<Event>): Promise<Event>

// Deletar evento (apenas admin)
eventAPI.delete(id: string): Promise<void>
```

#### 2. User API (`userAPI`)
```typescript
// Obter usuário atual
userAPI.getCurrent(): Promise<User>

// Registrar novo usuário
userAPI.register(user: Omit<User, "id" | "createdAt">): Promise<User>

// Login
userAPI.login(email: string, password: string): Promise<{ user: User; token: string }>

// Logout
userAPI.logout(): Promise<void>
```

#### 3. Enrollment API (`enrollmentAPI`)
```typescript
// Buscar inscrições do usuário
enrollmentAPI.getByUser(userId: string): Promise<Enrollment[]>

// Buscar inscrições de um evento (apenas admin)
enrollmentAPI.getByEvent(eventId: string): Promise<Enrollment[]>

// Inscrever em evento
enrollmentAPI.create(userId: string, eventId: string): Promise<Enrollment>

// Cancelar inscrição
enrollmentAPI.cancel(enrollmentId: string): Promise<void>
```

#### 4. Rating API (`ratingAPI`)
```typescript
// Buscar avaliações de um evento
ratingAPI.getByEvent(eventId: string): Promise<Rating[]>

// Criar avaliação
ratingAPI.create(rating: Omit<Rating, "id" | "createdAt">): Promise<Rating>
```

## Como Integrar o Backend

### Opção 1: Lovable Cloud (Recomendado)

1. Clique no botão "Connect Lovable Cloud" no chat
2. Aguarde a configuração automática do backend
3. Substitua as funções em `src/services/api.ts` com chamadas reais ao Supabase
4. Configure as políticas RLS (Row Level Security) no Supabase

### Opção 2: Backend Customizado

1. Configure seu servidor backend (Node.js, Python, etc.)
2. Crie os endpoints correspondentes às APIs definidas
3. Substitua os `throw new Error("Backend not implemented yet")` em `src/services/api.ts`
4. Configure CORS no seu backend
5. Adicione autenticação JWT ou similar

## Exemplo de Implementação com Fetch

```typescript
// Exemplo: Implementar eventAPI.getAll()
getAll: async (): Promise<Event[]> => {
  const response = await fetch('/api/events', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar eventos');
  }
  
  return response.json();
}
```

## Banco de Dados Sugerido

### Tabela: events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('oficina', 'palestra', 'reuniao')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  max_vacancies INTEGER NOT NULL,
  available_vacancies INTEGER NOT NULL,
  requirements TEXT,
  target_audience VARCHAR(255),
  duration VARCHAR(50),
  instructor VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
  age INTEGER,
  phone VARCHAR(20),
  school VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: enrollments
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  UNIQUE(user_id, event_id)
);
```

### Tabela: ratings
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
```

## Autenticação

O sistema está preparado para autenticação baseada em token JWT:

1. Login retorna um token
2. Token é armazenado (localStorage ou cookie)
3. Token é enviado em todas as requisições via header Authorization
4. Backend valida o token em cada requisição

## Próximos Passos

1. [ ] Escolher entre Lovable Cloud ou backend customizado
2. [ ] Implementar as funções em `src/services/api.ts`
3. [ ] Configurar variáveis de ambiente (API_URL, etc.)
4. [ ] Testar cada endpoint individualmente
5. [ ] Implementar tratamento de erros
6. [ ] Adicionar loading states nos componentes
7. [ ] Implementar refresh de tokens (se usar JWT)
8. [ ] Configurar política de CORS
9. [ ] Implementar validação de dados
10. [ ] Adicionar testes de integração

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url (se usar Lovable Cloud)
VITE_SUPABASE_ANON_KEY=your_anon_key (se usar Lovable Cloud)
```

## Recursos Úteis

- [Documentação Lovable Cloud](https://docs.lovable.dev/features/cloud)
- [Supabase Documentation](https://supabase.io/docs)
- [React Query para gerenciar estado de API](https://tanstack.com/query/latest)
