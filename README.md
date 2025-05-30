# StormTifão App

**ARTHUR FENILI           - RM552752**
**ENZO ANTUNES OLIVEIRA   - RM553185**
**VINICIO RAPHAEL SANTANA - RM553813**


**StormTifão** é um aplicativo móvel desenvolvido para auxiliar cidadãos a encontrar e gerenciar abrigos seguros em situações de desastres naturais. 

---

## 📋 Objetivos

- Permitir que qualquer usuário cadastre-se, faça login e visualize abrigos próximos no mapa.
- Só usuários administradores podem criar, editar ou remover abrigos.
- Autenticação via Firebase (email/senha).
- Interface clara com mapa interativo (react-native-maps) e lista estilizada.

---

## 🚀 Como testar localmente

### 1. Clonar repositórios

1. **Back-end Java**  
   ```bash
   git clone https://github.com/viniciors/demo-api.git
   cd demo-api
   ```
2. **Front-end Expo**  
   ```bash
   git clone https://github.com/viniciors/StormTifao-app.git
   cd StormTifao-app
   ```

### 2. Rodar o back-end

No diretório `demo-api`:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

- A API ficará disponível em `http://localhost:8080/api/shelters`.
- Console H2: `http://localhost:8080/h2-console`, URL JDBC `jdbc:h2:mem:testdb`, usuário `sa`, senha em branco.

### 3. Configurar o front-end

No diretório `StormTifao-app`:

1. Instale dependências:
   ```bash
   npm install
   ```
2. Configure `src/config/api.js` com o host da sua API:
   ```js
   export const API_BASE = 'http://<SEU_IP/api';
   ```
   - Use `localhost` no iOS Simulator, `10.0.2.2` no Android Emulator, ou seu IP em dispositivo real.
   - O frontend e o backend precisam estar rodando na mesma rede para funcionar.

3. Limpe cache e inicie:
   ```bash
   expo start -c
   ```

### 4. Usuário Administrador

- **Email**: `admin@seuapp.com`  
- **Senha**: `admin123`

- Para usar com um usuário comum, basta clicar em "Cadastrar" e criar um novo usuário com email e senha.
- Apenas o usuário administrador consegue fazer alterações na lista de abrigos para realizar o CRUD.

**É necessário logar com o usuário administrador e criar um novo abrigo para poder ver a lista e o abrigo no mapa.**


---

## 📁 Estrutura de pastas

```
StormTifao-app/
├── assets/             # Imagens (logo, splash, ícone, etc.)
├── src/
│   ├── config/         # API_BASE e instância Axios
│   ├── services/       # Chamadas à API (shelterService.js)
│   ├── firebase/       # Configuração Firebase
│   ├── screens/        # Telas:
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ShelterFormScreen.js
│   │   └── ProfileScreen.js
│   └── App.js          # Navegação e entry point
├── app.json            # Config Expo (icon, splash, etc.)
├── package.json
└── README.md           # Documentação (este arquivo)
```

No back-end `demo-api`:

```
demo-api/
├── src/main/java/com/example/demo/
│   ├── DemoApplication.java
│   ├── model/Shelter.java
│   ├── repository/ShelterRepository.java
│   └── controller/ShelterController.java
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── mvnw, mvnw.cmd, etc.
```

---

## 🖥️ Funcionalidades por tela

### LoginScreen
- Logo no topo.
- Campos de email e senha.  
- Link “Esqueci minha senha”.  
- Botões “Entrar” (verde) e “Cadastro” (azul).  
- Redireciona para Home ou para Registro.

### RegisterScreen
- Preenchimento de nome completo, CEP, número, data de nascimento (com máscaras), email e senha.  
- Busca automática de endereço via ViaCEP.  
- Botão “Cadastrar” e link para voltar ao Login.

### ForgotPasswordScreen
- Campo de email para envio de link de redefinição.
- Integração Firebase Auth para reset.

### HomeScreen
- Pedido de permissão de localização.  
- Exibição de mapa centrado no usuário e marcadores de abrigos (fetch API).  
- Lista de abrigos abaixo do mapa com nome, capacidade e botões editar/excluir.  
- Ao clicar no item, mapa foca no marcador; ao tocar no mapa, recenter.
- Acesso à tela Perfil e Formulário de Abrigo.

### ShelterFormScreen
- Apenas administradores podem acessar.  
- Criar ou editar abrigo: nome, capacidade, localização via toque no mapa.  
- Chama API para POST/PUT e retorna à Home com estado atualizado.

### ProfileScreen
- Exibe dados do usuário logado.  
- Botão “Sair” desloga via Firebase e retorna ao Login.

---

## 🔧 Tecnologias

- **Front-end**: React Native, Expo, Axios, Firebase Auth, Expo Location, React Native Maps.  
- **Back-end**: Java, Spring Boot, Spring Data JPA, H2 Database.  
- **Gerenciamento**: Maven, npm/yarn.

---