# SafuWallet — Building a Next-Gen Web3 Wallet (MVP)

Welcome to **SafuWallet**, my open-sourced build of a lightweight Web3 wallet focused on simplicity, security, and realworld use.

The idea is simple:

> Make self-custody easy, funds stay SAFU

I’m building this **in public**, so you can follow progress, contribute, or even fork it to learn from the codebase.

---

## Getting Started

```bash
git clone https://github.com/midesofek/Safu-Web3-Wallets.git
cd wallet-backend
npm install
node server.js
```

---

## 🚀 MVP Progress

☑️ **Create / Import Seed Phrase + Encrypted Local Storage**  
☑️ **Wallet Recovery** — Users can recover mnemonics using their password (decrypted locally)  
☑️ **Balance + Transaction Fetching** (via Zerion API)  
☑️ **Basic Send/Receive for ERC-20 + ETH**  
☑️ **Transaction Status / Confirmation Tracking**  
🔜 **In-App Token Swaps** (via DEX aggregator — 1inch)  
🔜 **WalletConnect v2 Support**  
🔜 **Account Abstraction (Smart Accounts)** — optional toggle for users who want smart wallets  
🔜 **Simple, Polished UI/UX + Onboarding Flow**  
🔜 **DApp Interface** - to enable users interact with dApps directly from the wallet

---

## TECH STACK

- **Backend:** Node.js / Fastify
- **Mnemonic Generation:** BIP-39 Standard
- **Web3:** ethers.js
- **APIs:** Zerion API
- **Storage:** AES Encryption + MongoDB
- **Security:** No mnemonic ever leaves the client

🔜 **Frontend:** React / Next.js
