const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da raiz
app.use(express.static('.'));

// Configurações da API
const API_CONFIG = {
    baseURL: process.env.NHONGA_API_URL || 'https://nhonga.net/api',
    secretKey: process.env.NHONGA_API_KEY || '03gdpgmaoh6o46m7pqg3v8d6ggecik8p68dyou7zvvwvr8qjclms5mprowv9',
    webhookSecret: process.env.NHONGA_WEBHOOK_SECRET || 'hmthkoukhk5z47jul0nvys68h8sc0ihukn0wsd0'
};

// Armazenamento em memória (em produção, usar banco de dados)
const payments = new Map();
const webhookEvents = [];

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rotas da API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AMSync Payment Server funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota para criar pagamento
app.post('/api/payment/create', async (req, res) => {
    try {
        const { 
            method, 
            amount, 
            context, 
            useremail, 
            userwhatsApp, 
            phone,
            planName,
            planId 
        } = req.body;

        // Validações
        if (!method || !amount || !context || !useremail || !userwhatsApp || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Todos os campos obrigatórios devem ser preenchidos'
            });
        }

        if (!['mpesa', 'emola'].includes(method)) {
            return res.status(400).json({
                success: false,
                error: 'Método de pagamento deve ser "mpesa" ou "emola"'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valor deve ser maior que zero'
            });
        }

        // Criar pagamento na API da Nhonga
        const paymentData = {
            method,
            amount: parseInt(amount),
            context: `${context} - ${planName || 'AMSync Ads'}`,
            useremail,
            userwhatsApp,
            phone
        };

        console.log('Enviando pagamento para Nhonga:', paymentData);

        const response = await axios.post(`${API_CONFIG.baseURL}/payment/mobile`, paymentData, {
            headers: {
                'Content-Type': 'application/json',
                'apiKey': API_CONFIG.secretKey
            }
        });

        if (response.data.success) {
            const payment = {
                id: response.data.id,
                ...paymentData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                planId,
                planName
            };

            payments.set(response.data.id, payment);

            res.json({
                success: true,
                paymentId: response.data.id,
                message: 'Pagamento criado com sucesso!',
                payment
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Erro ao criar pagamento na API'
            });
        }

    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Rota para verificar status do pagamento
app.get('/api/payment/status/:paymentId', (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = payments.get(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Pagamento não encontrado'
            });
        }

        res.json({
            success: true,
            payment
        });

    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota para listar todos os pagamentos
app.get('/api/payments', (req, res) => {
    try {
        const paymentsList = Array.from(payments.values());
        res.json({
            success: true,
            payments: paymentsList,
            total: paymentsList.length
        });
    } catch (error) {
        console.error('Erro ao listar pagamentos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Webhook para receber notificações da Nhonga
app.post('/api/webhook/nhonga', (req, res) => {
    try {
        const secretKey = req.headers['secretkey'];
        
        // Verificar chave secreta
        if (secretKey !== API_CONFIG.webhookSecret) {
            console.error('Webhook com chave inválida:', secretKey);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const webhookData = req.body;
        console.log('Webhook recebido:', webhookData);

        // Salvar evento do webhook
        webhookEvents.push({
            ...webhookData,
            receivedAt: new Date().toISOString()
        });

        // Atualizar status do pagamento
        if (webhookData.id && payments.has(webhookData.id)) {
            const payment = payments.get(webhookData.id);
            payment.status = webhookData.paid ? 'completed' : 'failed';
            payment.webhookData = webhookData;
            payment.updatedAt = new Date().toISOString();
            
            payments.set(webhookData.id, payment);
            console.log('Pagamento atualizado:', payment);
        }

        res.json({ success: true, message: 'Webhook processado' });

    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para listar webhooks
app.get('/api/webhooks', (req, res) => {
    try {
        res.json({
            success: true,
            webhooks: webhookEvents,
            total: webhookEvents.length
        });
    } catch (error) {
        console.error('Erro ao listar webhooks:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota para simular pagamento (desenvolvimento)
app.post('/api/payment/simulate', (req, res) => {
    try {
        const { paymentId, status } = req.body;
        const payment = payments.get(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Pagamento não encontrado'
            });
        }

        payment.status = status;
        payment.updatedAt = new Date().toISOString();
        payments.set(paymentId, payment);

        res.json({
            success: true,
            message: `Pagamento ${paymentId} simulado como ${status}`,
            payment
        });

    } catch (error) {
        console.error('Erro ao simular pagamento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Middleware de erro
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
    });
});

// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 AMSync Payment Server rodando na porta ${PORT}`);
    console.log(`📱 API de pagamentos integrada com Nhonga.net`);
    console.log(`🔗 Webhook URL: http://localhost:${PORT}/api/webhook/nhonga`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/payments`);
});

module.exports = app;
