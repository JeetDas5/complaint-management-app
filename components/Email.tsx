import React from 'react';

export interface EmailProps {
  type: 'new-complaint' | 'status-update';
  complaint: {
    id?: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status?: 'pending' | 'in-progress' | 'resolved';
    dateSubmitted: Date;
  };
  user: {
    name: string;
    email: string;
  };
  previousStatus?: string;
}

const Email: React.FC<EmailProps> = ({ type, complaint, user, previousStatus }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: type === 'new-complaint' ? '#3b82f6' : '#8b5cf6',
        color: 'white',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {type === 'new-complaint' ? '🆕 New Complaint Registered' : '🔄 Complaint Status Updated'}
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '16px',
          opacity: '0.9'
        }}>
          {type === 'new-complaint' 
            ? 'A new complaint has been submitted and requires attention'
            : 'The status of a complaint has been updated'
          }
        </p>
      </div>

      <div style={{ padding: '32px 24px' }}>
     
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827'
          }}>
            {complaint.title}
          </h2>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{
              backgroundColor: getPriorityColor(complaint.priority),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {complaint.priority} Priority
            </span>
            {complaint.status && (
              <span style={{
                backgroundColor: getStatusColor(complaint.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {complaint.status.replace('-', ' ')}
              </span>
            )}
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {complaint.category}
            </span>
          </div>
        </div>

        {type === 'status-update' && previousStatus && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#0369a1'
            }}>
              Status Change
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: getStatusColor(previousStatus),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {previousStatus.replace('-', ' ')}
              </span>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>→</span>
              <span style={{
                backgroundColor: getStatusColor(complaint.status || 'pending'),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {(complaint.status || 'pending').replace('-', ' ')}
              </span>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Description
          </h3>
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '16px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#4b5563'
          }}>
            {complaint.description}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Submitted By
            </h4>
            <p style={{
              margin: '0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#111827'
            }}>
              {user.name}
            </p>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '13px',
              color: '#6b7280'
            }}>
              {user.email}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Date Submitted
            </h4>
            <p style={{
              margin: '0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#111827'
            }}>
              {formatDate(complaint.dateSubmitted)}
            </p>
          </div>

          {complaint.id && (
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Complaint ID
              </h4>
              <p style={{
                margin: '0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                fontFamily: 'monospace'
              }}>
                #{complaint.id.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
        </div>

        <div style={{
          backgroundColor: type === 'new-complaint' ? '#fef3c7' : '#f3e8ff',
          border: `1px solid ${type === 'new-complaint' ? '#f59e0b' : '#8b5cf6'}`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: type === 'new-complaint' ? '#92400e' : '#6b21a8'
          }}>
            {type === 'new-complaint' ? '⚡ Action Required' : '📋 Next Steps'}
          </h3>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: type === 'new-complaint' ? '#92400e' : '#6b21a8',
            lineHeight: '1.5'
          }}>
            {type === 'new-complaint' 
              ? 'Please review this complaint and assign it to the appropriate team member. Consider the priority level and respond accordingly.'
              : 'The complaint status has been updated. Please ensure all stakeholders are informed and take any necessary follow-up actions.'
            }
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          This is an automated notification from the Complaint Management System
        </p>
        <p style={{
          margin: '0',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          Please do not reply to this email. For support, contact your system administrator.
        </p>
      </div>
    </div>
  );
};

export default Email;