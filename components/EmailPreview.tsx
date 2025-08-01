'use client';

import React, { useState } from 'react';
import Email from './Email';

const EmailPreview: React.FC = () => {
  const [emailType, setEmailType] = useState<'new-complaint' | 'status-update'>('new-complaint');

  const sampleComplaint = {
    id: '507f1f77bcf86cd799439011',
    title: 'Website Loading Issues',
    description: 'The main website is loading very slowly, especially during peak hours. Users are experiencing timeouts and connection errors. This is affecting our customer satisfaction and potentially impacting sales.',
    category: 'Technical',
    priority: 'high' as const,
    status: 'in-progress' as const,
    dateSubmitted: new Date('2024-01-15T10:30:00Z')
  };

  const sampleUser = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '600' }}>
            Email Template Preview
          </h1>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Email Type:
            </label>
            <select 
              value={emailType} 
              onChange={(e) => setEmailType(e.target.value as 'new-complaint' | 'status-update')}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="new-complaint">New Complaint</option>
              <option value="status-update">Status Update</option>
            </select>
          </div>
        </div>

        <Email
          type={emailType}
          complaint={sampleComplaint}
          user={sampleUser}
          previousStatus={emailType === 'status-update' ? 'pending' : undefined}
        />
      </div>
    </div>
  );
};

export default EmailPreview;