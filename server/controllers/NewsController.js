const { UserService } = require('../models/User');

class NewsController {
  // Get news articles
  static async getNews(req, res) {
    try {
      const { page = 1, limit = 20, category, search, sortBy = 'publishedAt', sortOrder = 'desc' } = req.query;

      // Mock news articles
      const articles = [
        {
          id: '1',
          title: 'Bitcoin Reaches New All-Time High Above $50,000',
          summary: 'Bitcoin has surged past $50,000 for the first time in months, driven by institutional adoption and positive market sentiment.',
          content: 'Bitcoin (BTC) has reached a new all-time high above $50,000, marking a significant milestone for the cryptocurrency market. The surge comes amid growing institutional adoption and positive regulatory developments...',
          category: 'crypto',
          tags: ['bitcoin', 'btc', 'price', 'all-time-high'],
          author: 'John Smith',
          source: 'CryptoNews',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          imageUrl: 'https://example.com/images/bitcoin-news.jpg',
          readTime: 5,
          views: 15420,
          likes: 1250,
          shares: 320
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Staking Rewards Increase by 15%',
          summary: 'Ethereum 2.0 staking rewards have increased significantly, attracting more validators to the network.',
          content: 'Ethereum 2.0 staking rewards have seen a substantial increase of 15% this month, making it more attractive for validators to participate in the network...',
          category: 'crypto',
          tags: ['ethereum', 'eth', 'staking', 'ethereum-2.0'],
          author: 'Jane Doe',
          source: 'EthereumNews',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          imageUrl: 'https://example.com/images/ethereum-news.jpg',
          readTime: 7,
          views: 8750,
          likes: 680,
          shares: 150
        },
        {
          id: '3',
          title: 'New Regulatory Framework for Cryptocurrency Trading',
          summary: 'Government announces new regulatory framework to provide clarity for cryptocurrency trading and investment.',
          content: 'The government has announced a new regulatory framework for cryptocurrency trading that aims to provide clarity and protection for investors...',
          category: 'regulation',
          tags: ['regulation', 'government', 'trading', 'compliance'],
          author: 'Mike Johnson',
          source: 'RegulatoryNews',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          imageUrl: 'https://example.com/images/regulation-news.jpg',
          readTime: 10,
          views: 12300,
          likes: 950,
          shares: 280
        },
        {
          id: '4',
          title: 'DeFi Protocol Launches New Yield Farming Opportunities',
          summary: 'A new DeFi protocol has launched with innovative yield farming opportunities for liquidity providers.',
          content: 'A new decentralized finance (DeFi) protocol has launched with innovative yield farming opportunities that could provide attractive returns for liquidity providers...',
          category: 'defi',
          tags: ['defi', 'yield-farming', 'liquidity', 'protocol'],
          author: 'Sarah Wilson',
          source: 'DeFiNews',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
          imageUrl: 'https://example.com/images/defi-news.jpg',
          readTime: 6,
          views: 6800,
          likes: 520,
          shares: 120
        },
        {
          id: '5',
          title: 'Major Bank Announces Cryptocurrency Custody Services',
          summary: 'A major traditional bank has announced plans to offer cryptocurrency custody services to institutional clients.',
          content: 'A major traditional bank has announced plans to offer cryptocurrency custody services to institutional clients, marking a significant step in the mainstream adoption of digital assets...',
          category: 'institutional',
          tags: ['bank', 'custody', 'institutional', 'adoption'],
          author: 'David Brown',
          source: 'BankingNews',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
          imageUrl: 'https://example.com/images/banking-news.jpg',
          readTime: 8,
          views: 9800,
          likes: 750,
          shares: 200
        }
      ];

      // Apply filters
      let filteredArticles = articles;
      
      if (category) {
        filteredArticles = filteredArticles.filter(article => article.category === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.summary.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Apply sorting
      filteredArticles.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          articles: paginatedArticles,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredArticles.length,
            pages: Math.ceil(filteredArticles.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting news:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get news'
      });
    }
  }

  // Get news article by ID
  static async getNewsArticle(req, res) {
    try {
      const { articleId } = req.params;

      // Mock news article
      const article = {
        id: articleId,
        title: 'Bitcoin Reaches New All-Time High Above $50,000',
        summary: 'Bitcoin has surged past $50,000 for the first time in months, driven by institutional adoption and positive market sentiment.',
        content: `
          <h2>Bitcoin Surges Past $50,000</h2>
          <p>Bitcoin (BTC) has reached a new all-time high above $50,000, marking a significant milestone for the cryptocurrency market. The surge comes amid growing institutional adoption and positive regulatory developments.</p>
          
          <h3>Key Factors Driving the Rally</h3>
          <ul>
            <li>Institutional adoption by major corporations</li>
            <li>Positive regulatory developments</li>
            <li>Growing acceptance as a store of value</li>
            <li>Limited supply and increasing demand</li>
          </ul>
          
          <p>The cryptocurrency has seen significant growth over the past year, with many analysts predicting continued upward momentum. The recent surge has been attributed to several key factors, including increased institutional interest and positive market sentiment.</p>
          
          <h3>Market Impact</h3>
          <p>The price surge has had a positive impact on the broader cryptocurrency market, with many altcoins also seeing significant gains. This has led to increased trading volume and market capitalization across the crypto ecosystem.</p>
        `,
        category: 'crypto',
        tags: ['bitcoin', 'btc', 'price', 'all-time-high'],
        author: 'John Smith',
        source: 'CryptoNews',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        imageUrl: 'https://example.com/images/bitcoin-news.jpg',
        readTime: 5,
        views: 15420,
        likes: 1250,
        shares: 320,
        relatedArticles: [
          {
            id: '2',
            title: 'Ethereum 2.0 Staking Rewards Increase by 15%',
            summary: 'Ethereum 2.0 staking rewards have increased significantly...',
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
          },
          {
            id: '3',
            title: 'New Regulatory Framework for Cryptocurrency Trading',
            summary: 'Government announces new regulatory framework...',
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
          }
        ]
      };

      res.json({
        success: true,
        data: article
      });
    } catch (error) {
      console.error('Error getting news article:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get news article'
      });
    }
  }

  // Get news categories
  static async getNewsCategories(req, res) {
    try {
      // Mock news categories
      const categories = [
        {
          id: 'crypto',
          name: 'Cryptocurrency',
          description: 'Latest news about cryptocurrencies and digital assets',
          articleCount: 45,
          color: '#f7931a'
        },
        {
          id: 'defi',
          name: 'DeFi',
          description: 'Decentralized finance news and updates',
          articleCount: 28,
          color: '#627eea'
        },
        {
          id: 'regulation',
          name: 'Regulation',
          description: 'Regulatory news and compliance updates',
          articleCount: 32,
          color: '#1f2937'
        },
        {
          id: 'institutional',
          name: 'Institutional',
          description: 'Institutional adoption and corporate news',
          articleCount: 18,
          color: '#2563eb'
        },
        {
          id: 'technology',
          name: 'Technology',
          description: 'Blockchain technology and development news',
          articleCount: 25,
          color: '#059669'
        },
        {
          id: 'market',
          name: 'Market Analysis',
          description: 'Market analysis and trading insights',
          articleCount: 38,
          color: '#dc2626'
        }
      ];

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error getting news categories:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get news categories'
      });
    }
  }

  // Get trending news
  static async getTrendingNews(req, res) {
    try {
      const { limit = 10 } = req.query;

      // Mock trending news
      const trendingNews = [
        {
          id: '1',
          title: 'Bitcoin Reaches New All-Time High Above $50,000',
          summary: 'Bitcoin has surged past $50,000 for the first time in months...',
          category: 'crypto',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          views: 15420,
          likes: 1250,
          shares: 320,
          trendScore: 95.5
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Staking Rewards Increase by 15%',
          summary: 'Ethereum 2.0 staking rewards have increased significantly...',
          category: 'crypto',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          views: 8750,
          likes: 680,
          shares: 150,
          trendScore: 87.2
        },
        {
          id: '3',
          title: 'New Regulatory Framework for Cryptocurrency Trading',
          summary: 'Government announces new regulatory framework...',
          category: 'regulation',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          views: 12300,
          likes: 950,
          shares: 280,
          trendScore: 82.8
        }
      ];

      res.json({
        success: true,
        data: trendingNews.slice(0, parseInt(limit))
      });
    } catch (error) {
      console.error('Error getting trending news:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get trending news'
      });
    }
  }

  // Like news article
  static async likeNewsArticle(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock liking article
      console.log(`User ${userId} liked article ${articleId}`);

      res.json({
        success: true,
        message: 'Article liked successfully'
      });
    } catch (error) {
      console.error('Error liking news article:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to like news article'
      });
    }
  }

  // Share news article
  static async shareNewsArticle(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.userId || 'demo-user';
      const { platform, message } = req.body;

      // Mock sharing article
      const share = {
        articleId,
        userId,
        platform,
        message,
        sharedAt: new Date()
      };

      console.log('Article shared:', share);

      res.json({
        success: true,
        message: 'Article shared successfully',
        data: share
      });
    } catch (error) {
      console.error('Error sharing news article:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to share news article'
      });
    }
  }

  // Get news subscriptions
  static async getNewsSubscriptions(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock news subscriptions
      const subscriptions = {
        userId,
        categories: ['crypto', 'defi', 'regulation'],
        keywords: ['bitcoin', 'ethereum', 'defi', 'staking'],
        sources: ['CryptoNews', 'EthereumNews', 'DeFiNews'],
        frequency: 'daily', // 'immediate', 'hourly', 'daily', 'weekly'
        email: true,
        push: true,
        sms: false
      };

      res.json({
        success: true,
        data: subscriptions
      });
    } catch (error) {
      console.error('Error getting news subscriptions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get news subscriptions'
      });
    }
  }

  // Update news subscriptions
  static async updateNewsSubscriptions(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const subscriptions = req.body;

      // Mock updating subscriptions
      const updatedSubscriptions = {
        userId,
        ...subscriptions,
        updatedAt: new Date()
      };

      console.log('News subscriptions updated:', updatedSubscriptions);

      res.json({
        success: true,
        message: 'News subscriptions updated successfully',
        data: updatedSubscriptions
      });
    } catch (error) {
      console.error('Error updating news subscriptions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update news subscriptions'
      });
    }
  }

  // Get news sources
  static async getNewsSources(req, res) {
    try {
      // Mock news sources
      const sources = [
        {
          id: 'cryptonews',
          name: 'CryptoNews',
          description: 'Leading cryptocurrency news and analysis',
          website: 'https://cryptonews.com',
          logo: 'https://example.com/logos/cryptonews.png',
          verified: true,
          articleCount: 1250
        },
        {
          id: 'ethereumnews',
          name: 'EthereumNews',
          description: 'Ethereum ecosystem news and updates',
          website: 'https://ethereumnews.com',
          logo: 'https://example.com/logos/ethereumnews.png',
          verified: true,
          articleCount: 850
        },
        {
          id: 'definews',
          name: 'DeFiNews',
          description: 'Decentralized finance news and insights',
          website: 'https://definews.com',
          logo: 'https://example.com/logos/definews.png',
          verified: true,
          articleCount: 650
        },
        {
          id: 'regulatorynews',
          name: 'RegulatoryNews',
          description: 'Cryptocurrency regulatory news and compliance',
          website: 'https://regulatorynews.com',
          logo: 'https://example.com/logos/regulatorynews.png',
          verified: false,
          articleCount: 420
        }
      ];

      res.json({
        success: true,
        data: sources
      });
    } catch (error) {
      console.error('Error getting news sources:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get news sources'
      });
    }
  }

  // Admin: Create news article
  static async createNewsArticle(req, res) {
    try {
      const { title, summary, content, category, tags, author, source, imageUrl } = req.body;

      // Mock creating news article
      const article = {
        id: Date.now().toString(),
        title,
        summary,
        content,
        category,
        tags: tags || [],
        author,
        source,
        imageUrl,
        publishedAt: new Date(),
        updatedAt: new Date(),
        readTime: Math.ceil(content.length / 1000), // Estimate read time
        views: 0,
        likes: 0,
        shares: 0
      };

      console.log('News article created:', article);

      res.status(201).json({
        success: true,
        message: 'News article created successfully',
        data: article
      });
    } catch (error) {
      console.error('Error creating news article:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create news article'
      });
    }
  }

  // Admin: Update news article
  static async updateNewsArticle(req, res) {
    try {
      const { articleId } = req.params;
      const updates = req.body;

      // Mock updating news article
      const updatedArticle = {
        id: articleId,
        ...updates,
        updatedAt: new Date()
      };

      console.log('News article updated:', updatedArticle);

      res.json({
        success: true,
        message: 'News article updated successfully',
        data: updatedArticle
      });
    } catch (error) {
      console.error('Error updating news article:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update news article'
      });
    }
  }

  // Admin: Delete news article
  static async deleteNewsArticle(req, res) {
    try {
      const { articleId } = req.params;

      // Mock deleting news article
      console.log(`News article ${articleId} deleted`);

      res.json({
        success: true,
        message: 'News article deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting news article:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete news article'
      });
    }
  }
}

module.exports = { NewsController };
