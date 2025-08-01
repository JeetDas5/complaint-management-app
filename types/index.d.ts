export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  dateSubmitted: Date;
  user: User | string;
}

export interface EmailTemplateProps {
  type: 'new-complaint' | 'status-update';
  complaint: Complaint;
  user: User;
  previousStatus?: string;
}