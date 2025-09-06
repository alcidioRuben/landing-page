# Implementação do Meta Pixel - LacasaDigital

## 📊 Visão Geral

O Meta Pixel (Facebook Pixel) foi implementado de forma completa no projeto LacasaDigital para rastrear conversões, engajamento dos usuários e otimizar campanhas de marketing.

## 🎯 Pixel ID
- **ID do Pixel**: `1366085291900813`
- **Localização**: `index.html` (código base)

## 🛠️ Arquivos Implementados

### 1. Serviço Principal
- **Arquivo**: `src/services/metaPixel.js`
- **Função**: Gerencia todos os eventos de rastreamento
- **Recursos**:
  - Verificação de disponibilidade do pixel
  - Métodos para eventos padrão e customizados
  - Funções específicas para o curso de dropshipping

### 2. Páginas com Rastreamento

#### 🏠 Página Home (`src/pages/Home.jsx`)
**Eventos Rastreados**:
- `PageView` - Visualização da página inicial
- `ViewContent` - Interesse no curso
- `CTA_Click` - Cliques em botões de ação
- `Video_View` - Visualização do vídeo principal
- `Testimonial_View` - Interação com depoimentos
- `Comment_Add` - Adição de comentários
- `Deep_Scroll` - Scroll profundo (75%+)
- `Time_On_Page` - Tempo na página (30+ segundos)
- `WhatsApp_Click` - Cliques no WhatsApp

#### 🔐 Página Login (`src/pages/Login.jsx`)
**Eventos Rastreados**:
- `InitiateCheckout` - Início do processo de login
- `CompleteRegistration` - Login/registro bem-sucedido
- `WhatsApp_Click` - Cliques no WhatsApp

#### 💳 Página Payment (`src/pages/Payment.jsx`)
**Eventos Rastreados**:
- `InitiateCheckout` - Início do processo de pagamento

#### ✅ Página PaymentSuccess (`src/pages/PaymentSuccess.jsx`)
**Eventos Rastreados**:
- `Purchase` - Compra concluída com sucesso

#### 📊 Página Dashboard (`src/pages/Dashboard.jsx`)
**Eventos Rastreados**:
- `PageView` - Visualização do dashboard do aluno

#### 📚 Página Recursos (`src/pages/Recursos.jsx`)
**Eventos Rastreados**:
- `PageView` - Visualização da página de recursos

#### ℹ️ Página Sobre (`src/pages/Sobre.jsx`)
**Eventos Rastreados**:
- `PageView` - Visualização da página sobre

#### 📞 Página Contato (`src/pages/Contato.jsx`)
**Eventos Rastreados**:
- `PageView` - Visualização da página de contato

## 🎯 Eventos Personalizados Implementados

### Eventos de Conversão
1. **`Purchase`** - Compra do curso (299 MZN)
2. **`CompleteRegistration`** - Registro/login bem-sucedido
3. **`InitiateCheckout`** - Início do processo de pagamento

### Eventos de Engajamento
1. **`CTA_Click`** - Cliques em botões de ação
2. **`Video_View`** - Visualização de vídeos
3. **`Comment_Add`** - Adição de comentários
4. **`Deep_Scroll`** - Scroll profundo na página
5. **`Time_On_Page`** - Tempo gasto na página
6. **`WhatsApp_Click`** - Contato via WhatsApp

### Eventos de Conteúdo
1. **`ViewContent`** - Visualização do curso
2. **`Testimonial_View`** - Visualização de depoimentos

## 📈 Parâmetros de Eventos

### Eventos de Compra
```javascript
{
  content_name: 'Curso Completo de Dropshipping',
  content_category: 'Digital Course',
  content_type: 'course',
  value: 299,
  currency: 'MZN',
  transaction_id: 'tx_1234567890'
}
```

### Eventos de CTA
```javascript
{
  button_text: 'Quero começar agora',
  location: 'Hero Section',
  content_name: 'Curso Dropshipping'
}
```

### Eventos de Comentário
```javascript
{
  content_name: 'Comentário Adicionado',
  content_category: 'User Engagement',
  rating: 5
}
```

## 🔧 Como Usar

### Importar o Serviço
```javascript
import metaPixelService from '../services/metaPixel';
```

### Rastrear Evento Simples
```javascript
metaPixelService.track('PageView', {
  content_name: 'Nome da Página',
  content_category: 'Categoria'
});
```

### Rastrear Evento Customizado
```javascript
metaPixelService.trackCustom('Meu_Evento', {
  parametro1: 'valor1',
  parametro2: 'valor2'
});
```

### Verificar Disponibilidade
```javascript
if (metaPixelService.isAvailable()) {
  // Pixel está disponível, pode rastrear
  metaPixelService.track('Evento');
}
```

## 📊 Métricas Rastreadas

### Conversões Principais
- ✅ Compras do curso
- ✅ Registros de usuários
- ✅ Logins bem-sucedidos

### Engajamento
- ✅ Tempo na página
- ✅ Scroll profundo
- ✅ Cliques em CTAs
- ✅ Visualização de vídeos
- ✅ Interação com comentários

### Funil de Vendas
1. **Awareness**: Visualização da página inicial
2. **Interest**: Interesse no curso, visualização de vídeos
3. **Consideration**: Scroll profundo, tempo na página
4. **Intent**: Cliques em CTAs, início do checkout
5. **Purchase**: Compra concluída

## 🎯 Otimizações para Campanhas

### Eventos para Lookalike Audiences
- `ViewContent` - Pessoas interessadas no curso
- `InitiateCheckout` - Pessoas próximas da compra
- `CompleteRegistration` - Pessoas que se registraram

### Eventos para Retargeting
- `Deep_Scroll` - Pessoas engajadas
- `Time_On_Page` - Pessoas interessadas
- `Comment_Add` - Pessoas altamente engajadas

### Eventos para Otimização
- `Purchase` - Para otimizar conversões
- `InitiateCheckout` - Para otimizar leads qualificados
- `CompleteRegistration` - Para otimizar registros

## 🚀 Próximos Passos

1. **Configurar Conversões no Facebook Ads**
   - Definir eventos de conversão no Facebook Ads Manager
   - Configurar valores de conversão
   - Criar audiences personalizadas

2. **Implementar Testes A/B**
   - Usar dados do pixel para otimizar landing pages
   - Testar diferentes CTAs e posicionamentos

3. **Análise de Funil**
   - Configurar relatórios de funil no Facebook Analytics
   - Identificar pontos de abandono

4. **Automações**
   - Configurar regras de automação baseadas nos eventos
   - Criar sequências de remarketing

## 🔍 Verificação

Para verificar se o pixel está funcionando:

1. **Facebook Pixel Helper** (extensão do Chrome)
2. **Console do navegador** - logs dos eventos
3. **Facebook Events Manager** - eventos em tempo real

## 📝 Logs de Debug

O serviço inclui logs detalhados no console:
```javascript
// Exemplo de log
Evento Meta Pixel rastreado: PageView {content_name: "Página Inicial - Curso Dropshipping"}
```

## ⚠️ Considerações Importantes

1. **GDPR/Privacidade**: Implementar consentimento do usuário se necessário
2. **Performance**: O pixel é carregado de forma assíncrona
3. **Fallbacks**: O serviço verifica disponibilidade antes de rastrear
4. **Debug**: Logs são exibidos apenas em desenvolvimento

---

**Implementação concluída em**: $(date)
**Pixel ID**: 1366085291900813
**Status**: ✅ Ativo e Funcionando
