# CoreX Backend Server

This is the backend server for CoreX - Next-Generation DeFi & Crypto Trading Platform.

## Features

- **Authentication**: JWT-based authentication with registration and login
- **DeFi Integration**: Smart contract interaction and DeFi protocol support
- **Market Data**: Real-time multi-chain market data and DeFi analytics
- **DEX Trading**: Decentralized exchange trading with order placement and execution
- **Wallet Management**: Multi-chain wallet support and transaction history
- **Yield Farming**: APY tracking and farming position management
- **WebSocket**: Real-time data streaming for live updates
- **Security**: Rate limiting, CORS protection, and helmet security headers

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

### Markets
- `GET /api/markets` - Get all trading pairs
- `GET /api/markets/:pair` - Get specific market data
- `GET /api/markets/stats/overview` - Get market statistics
- `GET /api/markets/:pair/history` - Get price history

### Trading
- `GET /api/trading/orderbook/:pair` - Get order book
- `GET /api/trading/trades/:pair` - Get recent trades
- `POST /api/trading/orders` - Place new order
- `GET /api/trading/orders` - Get user orders
- `DELETE /api/trading/orders/:orderId` - Cancel order

### Wallet
- `GET /api/wallet/balances` - Get wallet balances
- `GET /api/wallet/transactions` - Get transaction history

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## WebSocket

The server includes a WebSocket server at `/ws` for real-time data streaming.

### WebSocket Events
- `subscribe` - Subscribe to market data
- `ping` - Ping the server
- `pong` - Server response to ping

## Development

The server runs on port 3001 by default and includes:
- Hot reloading with nodemon
- CORS enabled for frontend development
- Comprehensive error handling
- Request logging
- Security middleware

## Environment Variables

Create a `.env` file in the root directory with:

```
PORT=3001
FRONTEND_PORT=8080
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
```

## Mock Data

The server currently uses mock data for development. In production, you would:
- Connect to a real database (MongoDB/PostgreSQL)
- Integrate with Web3 providers and smart contracts
- Connect to DeFi protocols (Uniswap, Aave, Compound, etc.)
- Integrate with DEX aggregators for best rates
- Implement proper order matching engine
- Add real-time price feeds and TVL data
- Implement multi-chain RPC connections
- Add proper security measures and smart contract audits
