
const BASE = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.BASE_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: 'Base Explorer',
      url: 'https://basescan.org',
    },
  },
}

const SCROLL = {
  id: 534352,
  name: 'Scroll',
  nativeCurrency: {
    name: 'Scroll',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.SCROLL_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scroll Explorer',
      url: 'https://scrollscan.com',
    },
  },
}

const ETHEREUM = {
  id: 1,
  name: 'Ethereum',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.ETHEREUM_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
}


export const CONFIG = {
  TELEGRAM_URL: 'https://t.me/getduinbot',
  VALID_CHAINS: {
    base: BASE.id,
    ethereum: ETHEREUM.id,
    scroll: SCROLL.id,
  },
  VALID_CHAINS_LABELS: {
    'eip155:8453': 'Base',
    'eip155:1': 'Ethereum',
    'eip155:534352': 'Scroll',
  },
  SUPPORTED_CHAINS: [
    BASE,
    SCROLL,
    ETHEREUM,
  ]
}
