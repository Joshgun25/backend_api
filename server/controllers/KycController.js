const { UserService } = require('../models/User');

class KycController {
  // Get KYC status
  static async getKycStatus(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock KYC status
      const kycStatus = {
        userId,
        status: 'pending', // 'not_started', 'pending', 'approved', 'rejected'
        level: 1, // 1, 2, 3
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        reviewedAt: null,
        documents: [
          {
            type: 'identity',
            status: 'pending',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            fileName: 'passport.pdf'
          },
          {
            type: 'address',
            status: 'approved',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            fileName: 'utility_bill.pdf'
          }
        ],
        requirements: {
          level1: {
            name: 'Basic Verification',
            description: 'Verify your identity with government-issued ID',
            completed: true,
            requirements: ['identity_document', 'selfie']
          },
          level2: {
            name: 'Address Verification',
            description: 'Verify your residential address',
            completed: true,
            requirements: ['address_document']
          },
          level3: {
            name: 'Enhanced Verification',
            description: 'Additional verification for higher limits',
            completed: false,
            requirements: ['income_proof', 'source_of_funds']
          }
        },
        limits: {
          dailyDeposit: 10000,
          dailyWithdrawal: 10000,
          monthlyDeposit: 100000,
          monthlyWithdrawal: 100000
        }
      };

      res.json({
        success: true,
        data: kycStatus
      });
    } catch (error) {
      console.error('Error getting KYC status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get KYC status'
      });
    }
  }

  // Submit KYC documents
  static async submitKycDocuments(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { documents, personalInfo } = req.body;

      // Mock document submission
      const submission = {
        id: Date.now().toString(),
        userId,
        documents: documents.map(doc => ({
          type: doc.type,
          fileName: doc.fileName,
          uploadedAt: new Date(),
          status: 'pending'
        })),
        personalInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          dateOfBirth: personalInfo.dateOfBirth,
          nationality: personalInfo.nationality,
          address: personalInfo.address
        },
        submittedAt: new Date(),
        status: 'pending'
      };

      console.log('KYC documents submitted:', submission);

      res.status(201).json({
        success: true,
        message: 'KYC documents submitted successfully',
        data: submission
      });
    } catch (error) {
      console.error('Error submitting KYC documents:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to submit KYC documents'
      });
    }
  }

  // Upload document
  static async uploadDocument(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { type, fileName, fileSize } = req.body;

      // Mock document upload
      const document = {
        id: Date.now().toString(),
        userId,
        type,
        fileName,
        fileSize,
        uploadedAt: new Date(),
        status: 'pending',
        url: `/uploads/kyc/${userId}/${fileName}`
      };

      console.log('Document uploaded:', document);

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload document'
      });
    }
  }

  // Get KYC requirements
  static async getKycRequirements(req, res) {
    try {
      const { level = 1 } = req.query;

      // Mock KYC requirements
      const requirements = {
        level1: {
          name: 'Basic Verification',
          description: 'Verify your identity to start trading',
          maxLimits: {
            dailyDeposit: 1000,
            dailyWithdrawal: 1000,
            monthlyDeposit: 10000,
            monthlyWithdrawal: 10000
          },
          documents: [
            {
              type: 'identity',
              name: 'Government-issued ID',
              description: 'Passport, Driver\'s License, or National ID',
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: '10MB',
              required: true
            },
            {
              type: 'selfie',
              name: 'Selfie with ID',
              description: 'Take a selfie holding your ID document',
              acceptedFormats: ['jpg', 'png'],
              maxSize: '5MB',
              required: true
            }
          ]
        },
        level2: {
          name: 'Address Verification',
          description: 'Verify your residential address for higher limits',
          maxLimits: {
            dailyDeposit: 10000,
            dailyWithdrawal: 10000,
            monthlyDeposit: 100000,
            monthlyWithdrawal: 100000
          },
          documents: [
            {
              type: 'address',
              name: 'Proof of Address',
              description: 'Utility bill, bank statement, or government letter',
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: '10MB',
              required: true,
              maxAge: 90 // days
            }
          ]
        },
        level3: {
          name: 'Enhanced Verification',
          description: 'Additional verification for institutional limits',
          maxLimits: {
            dailyDeposit: 100000,
            dailyWithdrawal: 100000,
            monthlyDeposit: 1000000,
            monthlyWithdrawal: 1000000
          },
          documents: [
            {
              type: 'income_proof',
              name: 'Proof of Income',
              description: 'Salary certificate, tax return, or bank statement',
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: '10MB',
              required: true
            },
            {
              type: 'source_of_funds',
              name: 'Source of Funds',
              description: 'Documentation explaining the source of your funds',
              acceptedFormats: ['pdf', 'jpg', 'png'],
              maxSize: '10MB',
              required: true
            }
          ]
        }
      };

      res.json({
        success: true,
        data: requirements[`level${level}`] || requirements
      });
    } catch (error) {
      console.error('Error getting KYC requirements:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get KYC requirements'
      });
    }
  }

  // Get KYC history
  static async getKycHistory(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock KYC history
      const history = [
        {
          id: '1',
          userId,
          level: 1,
          status: 'approved',
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29),
          reviewedBy: 'admin@lumen.com',
          notes: 'Identity verification completed successfully'
        },
        {
          id: '2',
          userId,
          level: 2,
          status: 'pending',
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          reviewedAt: null,
          reviewedBy: null,
          notes: null
        }
      ];

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error getting KYC history:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get KYC history'
      });
    }
  }

  // Admin: Get all KYC submissions
  static async getAllKycSubmissions(req, res) {
    try {
      const { page = 1, limit = 20, status, level, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

      // Mock KYC submissions
      const submissions = [
        {
          id: '1',
          userId: 'user123',
          userEmail: 'john.doe@example.com',
          level: 1,
          status: 'pending',
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          documents: [
            { type: 'identity', status: 'pending', fileName: 'passport.pdf' },
            { type: 'selfie', status: 'pending', fileName: 'selfie.jpg' }
          ],
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            nationality: 'US'
          }
        },
        {
          id: '2',
          userId: 'user456',
          userEmail: 'jane.smith@example.com',
          level: 2,
          status: 'approved',
          submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
          reviewedBy: 'admin@lumen.com',
          documents: [
            { type: 'identity', status: 'approved', fileName: 'driver_license.pdf' },
            { type: 'address', status: 'approved', fileName: 'utility_bill.pdf' }
          ],
          personalInfo: {
            firstName: 'Jane',
            lastName: 'Smith',
            nationality: 'CA'
          }
        }
      ];

      // Apply filters
      let filteredSubmissions = submissions;
      
      if (status) {
        filteredSubmissions = filteredSubmissions.filter(sub => sub.status === status);
      }

      if (level) {
        filteredSubmissions = filteredSubmissions.filter(sub => sub.level === parseInt(level));
      }

      // Apply sorting
      filteredSubmissions.sort((a, b) => {
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
      const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          submissions: paginatedSubmissions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredSubmissions.length,
            pages: Math.ceil(filteredSubmissions.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting KYC submissions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get KYC submissions'
      });
    }
  }

  // Admin: Review KYC submission
  static async reviewKycSubmission(req, res) {
    try {
      const { submissionId } = req.params;
      const { status, notes, reviewerId } = req.body;

      // Mock KYC review
      const review = {
        submissionId,
        status, // 'approved', 'rejected', 'needs_more_info'
        notes,
        reviewerId,
        reviewedAt: new Date()
      };

      console.log('KYC submission reviewed:', review);

      res.json({
        success: true,
        message: `KYC submission ${status} successfully`,
        data: review
      });
    } catch (error) {
      console.error('Error reviewing KYC submission:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to review KYC submission'
      });
    }
  }

  // Get KYC statistics
  static async getKycStatistics(req, res) {
    try {
      // Mock KYC statistics
      const stats = {
        total: 15420,
        byStatus: {
          not_started: 5000,
          pending: 1200,
          approved: 8500,
          rejected: 720
        },
        byLevel: {
          level1: 12000,
          level2: 3000,
          level3: 420
        },
        processingTime: {
          average: 24, // hours
          median: 12,
          p95: 72
        },
        approvalRate: 92.2
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting KYC statistics:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get KYC statistics'
      });
    }
  }
}

module.exports = { KycController };
