const { UserService } = require('../models/User');

class SupportController {
  // Create support ticket
  static async createTicket(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { subject, category, priority, description, attachments } = req.body;

      // Mock ticket creation
      const ticket = {
        id: `TICKET-${Date.now()}`,
        userId,
        subject,
        category, // 'technical', 'account', 'trading', 'billing', 'general'
        priority, // 'low', 'medium', 'high', 'urgent'
        status: 'open', // 'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
        description,
        attachments: attachments || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: null,
        messages: [
          {
            id: '1',
            senderId: userId,
            senderType: 'user',
            message: description,
            timestamp: new Date(),
            attachments: attachments || []
          }
        ]
      };

      console.log('Support ticket created:', ticket);

      res.status(201).json({
        success: true,
        message: 'Support ticket created successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Error creating support ticket:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create support ticket'
      });
    }
  }

  // Get user tickets
  static async getUserTickets(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { page = 1, limit = 20, status, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      // Mock user tickets
      const tickets = [
        {
          id: 'TICKET-001',
          userId,
          subject: 'Unable to withdraw funds',
          category: 'account',
          priority: 'high',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          assignedTo: 'support@lumen.com',
          lastMessage: 'We are investigating your withdrawal issue...',
          unreadMessages: 1
        },
        {
          id: 'TICKET-002',
          userId,
          subject: 'Trading interface not loading',
          category: 'technical',
          priority: 'medium',
          status: 'resolved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          assignedTo: 'tech@lumen.com',
          lastMessage: 'Issue has been resolved. Please try again.',
          unreadMessages: 0
        },
        {
          id: 'TICKET-003',
          userId,
          subject: 'KYC verification question',
          category: 'account',
          priority: 'low',
          status: 'open',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          assignedTo: null,
          lastMessage: 'Please provide additional documentation...',
          unreadMessages: 0
        }
      ];

      // Apply filters
      let filteredTickets = tickets;
      
      if (status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
      }

      if (category) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
      }

      // Apply sorting
      filteredTickets.sort((a, b) => {
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
      const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          tickets: paginatedTickets,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredTickets.length,
            pages: Math.ceil(filteredTickets.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting user tickets:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get user tickets'
      });
    }
  }

  // Get ticket details
  static async getTicketDetails(req, res) {
    try {
      const { ticketId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock ticket details
      const ticket = {
        id: ticketId,
        userId,
        subject: 'Unable to withdraw funds',
        category: 'account',
        priority: 'high',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        assignedTo: 'support@lumen.com',
        messages: [
          {
            id: '1',
            senderId: userId,
            senderType: 'user',
            senderName: 'John Doe',
            message: 'I am unable to withdraw my USDT funds. The withdrawal button is grayed out and I get an error message.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            attachments: []
          },
          {
            id: '2',
            senderId: 'support@lumen.com',
            senderType: 'support',
            senderName: 'Sarah Johnson',
            message: 'Thank you for contacting us. I can see that your account is currently under review for KYC verification. This is why withdrawals are temporarily disabled. Please complete your KYC verification to restore withdrawal functionality.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            attachments: []
          },
          {
            id: '3',
            senderId: userId,
            senderType: 'user',
            senderName: 'John Doe',
            message: 'I have already submitted my KYC documents 3 days ago. How long does the verification process take?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
            attachments: []
          },
          {
            id: '4',
            senderId: 'support@lumen.com',
            senderType: 'support',
            senderName: 'Sarah Johnson',
            message: 'I apologize for the delay. I can see your KYC documents are currently under review. Our team typically processes KYC verification within 24-48 hours. I will escalate your case to our KYC team for priority processing. You should receive an update within the next few hours.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            attachments: []
          }
        ]
      };

      res.json({
        success: true,
        data: ticket
      });
    } catch (error) {
      console.error('Error getting ticket details:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get ticket details'
      });
    }
  }

  // Add message to ticket
  static async addMessage(req, res) {
    try {
      const { ticketId } = req.params;
      const userId = req.user?.userId || 'demo-user';
      const { message, attachments } = req.body;

      // Mock adding message
      const newMessage = {
        id: Date.now().toString(),
        senderId: userId,
        senderType: 'user',
        senderName: 'John Doe',
        message,
        timestamp: new Date(),
        attachments: attachments || []
      };

      console.log(`Message added to ticket ${ticketId}:`, newMessage);

      res.status(201).json({
        success: true,
        message: 'Message added successfully',
        data: newMessage
      });
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to add message'
      });
    }
  }

  // Close ticket
  static async closeTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const userId = req.user?.userId || 'demo-user';
      const { reason } = req.body;

      // Mock closing ticket
      console.log(`Ticket ${ticketId} closed by user ${userId}, reason: ${reason}`);

      res.json({
        success: true,
        message: 'Ticket closed successfully'
      });
    } catch (error) {
      console.error('Error closing ticket:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to close ticket'
      });
    }
  }

  // Get support categories
  static async getSupportCategories(req, res) {
    try {
      const categories = [
        {
          id: 'technical',
          name: 'Technical Support',
          description: 'Issues with the platform, trading interface, or technical problems',
          icon: 'settings',
          responseTime: '2-4 hours'
        },
        {
          id: 'account',
          name: 'Account Support',
          description: 'Account verification, KYC, security, and profile issues',
          icon: 'user',
          responseTime: '4-8 hours'
        },
        {
          id: 'trading',
          name: 'Trading Support',
          description: 'Trading questions, order issues, and market-related inquiries',
          icon: 'trending-up',
          responseTime: '1-2 hours'
        },
        {
          id: 'billing',
          name: 'Billing Support',
          description: 'Deposits, withdrawals, fees, and payment-related issues',
          icon: 'credit-card',
          responseTime: '2-6 hours'
        },
        {
          id: 'general',
          name: 'General Inquiry',
          description: 'General questions about our services and platform',
          icon: 'help-circle',
          responseTime: '4-12 hours'
        }
      ];

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error getting support categories:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get support categories'
      });
    }
  }

  // Get FAQ
  static async getFAQ(req, res) {
    try {
      const { category, search } = req.query;

      // Mock FAQ data
      const faqs = [
        {
          id: '1',
          category: 'account',
          question: 'How do I verify my account?',
          answer: 'To verify your account, go to your profile settings and click on "Verify Account". You will need to provide a government-issued ID and proof of address. The verification process typically takes 24-48 hours.',
          helpful: 45,
          notHelpful: 2
        },
        {
          id: '2',
          category: 'trading',
          question: 'What are the trading fees?',
          answer: 'Our trading fees are 0.1% for both makers and takers. VIP users with higher trading volumes may be eligible for reduced fees.',
          helpful: 38,
          notHelpful: 1
        },
        {
          id: '3',
          category: 'billing',
          question: 'How long do withdrawals take?',
          answer: 'Withdrawal processing times vary by cryptocurrency. Bitcoin withdrawals typically take 10-30 minutes, while Ethereum withdrawals take 2-5 minutes. Bank transfers can take 1-3 business days.',
          helpful: 52,
          notHelpful: 3
        },
        {
          id: '4',
          category: 'technical',
          question: 'The trading interface is not loading properly',
          answer: 'Try refreshing your browser or clearing your cache. If the problem persists, try using a different browser or check if you have any browser extensions that might be interfering.',
          helpful: 28,
          notHelpful: 5
        },
        {
          id: '5',
          category: 'security',
          question: 'How do I enable two-factor authentication?',
          answer: 'Go to your security settings and click on "Enable 2FA". You can use Google Authenticator or Authy. Scan the QR code with your authenticator app and enter the verification code.',
          helpful: 41,
          notHelpful: 1
        }
      ];

      // Apply filters
      let filteredFAQs = faqs;
      
      if (category) {
        filteredFAQs = filteredFAQs.filter(faq => faq.category === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredFAQs = filteredFAQs.filter(faq => 
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower)
        );
      }

      res.json({
        success: true,
        data: filteredFAQs
      });
    } catch (error) {
      console.error('Error getting FAQ:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get FAQ'
      });
    }
  }

  // Rate FAQ helpfulness
  static async rateFAQ(req, res) {
    try {
      const { faqId } = req.params;
      const { helpful } = req.body; // true or false

      // Mock rating FAQ
      console.log(`FAQ ${faqId} rated as ${helpful ? 'helpful' : 'not helpful'}`);

      res.json({
        success: true,
        message: 'Thank you for your feedback'
      });
    } catch (error) {
      console.error('Error rating FAQ:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to rate FAQ'
      });
    }
  }

  // Admin: Get all tickets
  static async getAllTickets(req, res) {
    try {
      const { page = 1, limit = 20, status, category, priority, assignedTo, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      // Mock all tickets
      const tickets = [
        {
          id: 'TICKET-001',
          userId: 'user123',
          userEmail: 'john.doe@example.com',
          subject: 'Unable to withdraw funds',
          category: 'account',
          priority: 'high',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          assignedTo: 'support@lumen.com',
          responseTime: 2, // hours
          lastMessage: 'We are investigating your withdrawal issue...'
        },
        {
          id: 'TICKET-002',
          userId: 'user456',
          userEmail: 'jane.smith@example.com',
          subject: 'Trading interface not loading',
          category: 'technical',
          priority: 'medium',
          status: 'resolved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          assignedTo: 'tech@lumen.com',
          responseTime: 1,
          lastMessage: 'Issue has been resolved. Please try again.'
        }
      ];

      // Apply filters
      let filteredTickets = tickets;
      
      if (status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
      }

      if (category) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
      }

      if (priority) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
      }

      if (assignedTo) {
        filteredTickets = filteredTickets.filter(ticket => ticket.assignedTo === assignedTo);
      }

      // Apply sorting
      filteredTickets.sort((a, b) => {
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
      const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          tickets: paginatedTickets,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredTickets.length,
            pages: Math.ceil(filteredTickets.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting all tickets:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get all tickets'
      });
    }
  }

  // Admin: Assign ticket
  static async assignTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const { assignedTo, notes } = req.body;

      // Mock assigning ticket
      console.log(`Ticket ${ticketId} assigned to ${assignedTo}, notes: ${notes}`);

      res.json({
        success: true,
        message: 'Ticket assigned successfully'
      });
    } catch (error) {
      console.error('Error assigning ticket:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to assign ticket'
      });
    }
  }

  // Admin: Update ticket status
  static async updateTicketStatus(req, res) {
    try {
      const { ticketId } = req.params;
      const { status, notes } = req.body;

      // Mock updating ticket status
      console.log(`Ticket ${ticketId} status updated to ${status}, notes: ${notes}`);

      res.json({
        success: true,
        message: 'Ticket status updated successfully'
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update ticket status'
      });
    }
  }
}

module.exports = { SupportController };
