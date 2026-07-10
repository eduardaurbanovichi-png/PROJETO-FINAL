// Gerenciamento e Persistência de Configurações no localStorage
const Config = {
    defaults: {
        clinicName: "Clínica Urbanovichi",
        openRouterKey: window.GROQ_API_KEY || "", 
        aiModel: "llama-3.3-70b-versatile",
        theme: "light"
    },

    init() {
        // Garante que se o Render injetou a chave, ela seja usada prioritariamente
        if (window.GROQ_API_KEY && window.GROQ_API_KEY !== '${GROQ_API_KEY}') {
            this.defaults.openRouterKey = window.GROQ_API_KEY;
        }

        let current;
        try {
            current = JSON.parse(localStorage.getItem("urbanovichi_cfg")) || {};
        } catch(e) {
            current = {};
        }

        // Mescla as configurações salvas com as padrões da nuvem
        current.openRouterKey = current.openRouterKey || this.defaults.openRouterKey;
        current.clinicName = current.clinicName || this.defaults.clinicName;
        current.aiModel = current.aiModel || this.defaults.aiModel;
        current.theme = current.theme || this.defaults.theme;

        localStorage.setItem("urbanovichi_cfg", JSON.stringify(current));
    },

    get() {
        try {
            const data = localStorage.getItem("urbanovichi_cfg");
            return data ? JSON.parse(data) : this.defaults;
        } catch (e) {
            return this.defaults;
        }
    },

    save(newConfig) {
        localStorage.setItem("urbanovichi_cfg", JSON.stringify(newConfig));
    },

    updateKey(key, value) {
        const current = this.get();
        current[key] = value;
        this.save(current);
    }
};

// Inicialização imediata
Config.init();
