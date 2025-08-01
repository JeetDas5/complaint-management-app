interface ComplaintData {
    _id?: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status?: 'pending' | 'in-progress' | 'resolved';
    dateSubmitted: Date;
}

interface UserData {
    name: string;
    email: string;
}

function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#6b7280';
    }
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'resolved': return '#10b981';
        case 'in-progress': return '#f59e0b';
        case 'pending': return '#6b7280';
        default: return '#6b7280';
    }
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function generateEmailHTML(
    type: 'new-complaint' | 'status-update',
    complaint: ComplaintData,
    user: UserData,
    previousStatus?: string
): string {
    const isNewComplaint = type === 'new-complaint';
    const headerColor = isNewComplaint ? '#3b82f6' : '#8b5cf6';
    const headerTitle = isNewComplaint ? '🆕 New Complaint Registered' : '🔄 Complaint Status Updated';
    const headerSubtitle = isNewComplaint
        ? 'A new complaint has been submitted and requires attention'
        : 'The status of a complaint has been updated';

    const statusUpdateSection = !isNewComplaint && previousStatus ? `
    <div style="background-color:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:16px;margin-bottom:24px;">
      <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:#0369a1;">Status Change</h3>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="background-color:${getStatusColor(previousStatus)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;text-transform:capitalize;">
          ${previousStatus.replace('-', ' ')}
        </span>
        <span style="color:#6b7280;font-size:14px;">→</span>
        <span style="background-color:${getStatusColor(complaint.status || 'pending')};color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;text-transform:capitalize;">
          ${(complaint.status || 'pending').replace('-', ' ')}
        </span>
      </div>
    </div>
  ` : '';

    const complaintIdSection = complaint._id ? `
    <div style="background-color:#f9fafb;padding:16px;border-radius:6px;border:1px solid #e5e7eb;">
      <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">
        Complaint ID
      </h4>
      <p style="margin:0;font-size:14px;font-weight:600;color:#111827;font-family:monospace;">
        #${complaint._id.toString().slice(-8).toUpperCase()}
      </p>
    </div>
  ` : '';

    const actionColor = isNewComplaint ? '#fef3c7' : '#f3e8ff';
    const actionBorderColor = isNewComplaint ? '#f59e0b' : '#8b5cf6';
    const actionTextColor = isNewComplaint ? '#92400e' : '#6b21a8';
    const actionTitle = isNewComplaint ? '⚡ Action Required' : '📋 Next Steps';
    const actionText = isNewComplaint
        ? 'Please review this complaint and assign it to the appropriate team member. Consider the priority level and respond accordingly.'
        : 'The complaint status has been updated. Please ensure all stakeholders are informed and take any necessary follow-up actions.';

    return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <!-- Header -->
      <div style="background-color:${headerColor};color:white;padding:24px;text-align:center;">
        <h1 style="margin:0;font-size:24px;font-weight:600;">${headerTitle}</h1>
        <p style="margin:8px 0 0 0;font-size:16px;opacity:0.9;">${headerSubtitle}</p>
      </div>

      <!-- Content -->
      <div style="padding:32px 24px;">
        <!-- Complaint Title -->
        <div style="margin-bottom:24px;">
          <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#111827;">${complaint.title}</h2>
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
            <span style="background-color:${getPriorityColor(complaint.priority)};color:white;padding:4px 12px;border-radius:16px;font-size:12px;font-weight:600;text-transform:uppercase;">
              ${complaint.priority} Priority
            </span>
            ${complaint.status ? `
              <span style="background-color:${getStatusColor(complaint.status)};color:white;padding:4px 12px;border-radius:16px;font-size:12px;font-weight:600;text-transform:capitalize;">
                ${complaint.status.replace('-', ' ')}
              </span>
            ` : ''}
            <span style="background-color:#f3f4f6;color:#374151;padding:4px 12px;border-radius:16px;font-size:12px;font-weight:500;">
              ${complaint.category}
            </span>
          </div>
        </div>

        ${statusUpdateSection}

        <!-- Description -->
        <div style="margin-bottom:24px;">
          <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#374151;">Description</h3>
          <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:16px;font-size:14px;line-height:1.6;color:#4b5563;">
            ${complaint.description}
          </div>
        </div>

        <!-- Details Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
          <div style="background-color:#f9fafb;padding:16px;border-radius:6px;border:1px solid #e5e7eb;">
            <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">
              Submitted By
            </h4>
            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${user.name}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#6b7280;">${user.email}</p>
          </div>

          <div style="background-color:#f9fafb;padding:16px;border-radius:6px;border:1px solid #e5e7eb;">
            <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">
              Date Submitted
            </h4>
            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${formatDate(complaint.dateSubmitted)}</p>
          </div>

          ${complaintIdSection}
        </div>

        <!-- Action Required -->
        <div style="background-color:${actionColor};border:1px solid ${actionBorderColor};border-radius:8px;padding:16px;">
          <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:${actionTextColor};">${actionTitle}</h3>
          <p style="margin:0;font-size:14px;color:${actionTextColor};line-height:1.5;">${actionText}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#f9fafb;padding:24px;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">
          This is an automated notification from the Complaint Management System
        </p>
        <p style="margin:0;font-size:12px;color:#9ca3af;">
          Please do not reply to this email. For support, contact your system administrator.
        </p>
      </div>
    </div>
  `;
}

export function generateNewComplaintEmail(complaint: any, user: any): { subject: string; html: string } {
    const complaintData: ComplaintData = {
        _id: complaint._id?.toString(),
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        dateSubmitted: complaint.dateSubmitted || new Date()
    };

    const userData: UserData = {
        name: user.name,
        email: user.email
    };

    const html = generateEmailHTML('new-complaint', complaintData, userData);
    const subject = `🆕 New Complaint Registered: ${complaint.title}`;

    return {
        subject,
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${subject}</title></head><body style="margin:0;padding:20px;background-color:#f3f4f6;">${html}</body></html>`
    };
}

export function generateStatusUpdateEmail(
    complaint: any,
    user: any,
    previousStatus: string
): { subject: string; html: string } {
    const complaintData: ComplaintData = {
        _id: complaint._id?.toString(),
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        dateSubmitted: complaint.dateSubmitted || new Date()
    };

    const userData: UserData = {
        name: user.name,
        email: user.email
    };

    const html = generateEmailHTML('status-update', complaintData, userData, previousStatus);
    const subject = `🔄 Complaint Status Updated: ${complaint.title}`;

    return {
        subject,
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${subject}</title></head><body style="margin:0;padding:20px;background-color:#f3f4f6;">${html}</body></html>`
    };
}