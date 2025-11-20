# Temporal Configuration Service
Temporal Interface for the Chronos Industries Temporal Configuration Service

- ⏳ Navigate the hierarchical structure of Time Machines and their child configurations
- ⚡️ View parts and update their statuses
- ⌨️ Keyboard navigation
- 👆 Responsive design with mobile support

## Running Locally
### Requirements
- [nvm](https://github.com/nvm-sh/nvm)

### Running
1. Set up a .env file:
```bash
cat << EOF > .env
VITE_API_BASE_URL={https://your-api-endpoint.com}
VITE_API_KEY={your-api-key} 
EOF
```

2. Install
```
nvm install
npm install
```

3. Run
```
npm run dev
```
