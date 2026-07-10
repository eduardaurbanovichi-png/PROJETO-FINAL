const ApiService = {
    systemPrompt: `Você é Urbanovichi. Você trabalha na Clínica Urbanovichi. Seu objetivo é oferecer atendimento acolhedor, educado, humanizado e profissional.
Você pode: orientar pacientes; explicar exames; explicar convênios; informar horários; informar localização; explicar especialidades; responder dúvidas gerais; orientar preparo para exames; ajudar no processo de agendamento.
Você NÃO pode: fornecer diagnósticos definitivos; receitar medicamentos; substituir um médico; afirmar que alguém possui uma doença.
Sempre que houver dúvida médica importante, oriente o paciente a procurar atendimento presencial.
Sempre fale em português do Brasil. Utilize linguagem humanizada, clara, acolhedora e direta. Seja simpático. Seja profissional. Nunca invente informações. Caso não saiba algo, informe isso explicitamente.`,

    async sendMessage(chatHistory) {
        const settings = Config.get();
        
        if (!settings.openRouterKey) {
            throw new Error("Chave de API da Groq ausente. Verifique as configurações ou as variáveis do Render.");
        }

        const messages = [
            { role: "system", content: this.systemPrompt },
            ...chatHistory
        ];

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        try {
            // FORÇANDO O ENDPOINT EXCLUSIVO DA GROQ AQUI
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${settings.openRouterKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: messages,
                    temperature: 0.5
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `Erro HTTP Groq: ${response.status}`);
            }

            const data = await response.json();
            if (data?.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            } else {
                throw new Error("Resposta em branco vinda da Groq.");
            }

        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
};
