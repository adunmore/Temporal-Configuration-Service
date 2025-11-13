# Temporal Configuration Service

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